const Collection = require("../models/Collection");
const Painting = require("../models/Painting");
const { shapeCollection } = require("../utils/shapeCollection");
const { madeForYou, madeForYouBySlug } = require("../utils/madeForYou");
const { makeSlug } = require("../utils/makeSlug");

const populate = [{ path: "items.painting" }, { path: "leadPainting" }];

async function listCollections(request, response) {
  try {
    const type = request.query.type || "all";
    const user = request.user;
    if (type === "mine" && !user) {
      return response.status(401).json({ message: "Please log in first" });
    }
    let items = [];
    if (type === "all" || type === "chosen") {
      const chosen = await Collection.find({ type: "chosen" }).sort({ order: 1 }).populate(populate);
      items = chosen.map((collection) => shapeCollection(collection, false));
    }
    if ((type === "all" || type === "mine") && user) {
      const forYou = await madeForYou(user);
      const mine = await Collection.find({ type: "mine", user: user._id }).sort({ createdAt: -1 }).populate(populate);
      items = [...items, ...forYou.map((collection) => shapeCollection(collection, false)), ...mine.map((collection) => shapeCollection(collection, false))];
    }
    response.json({ items, total: items.length, page: 1, pages: 1 });
  } catch (error) {
    response.status(500).json({ message: "The collections could not be loaded" });
  }
}

async function findNext(slug) {
  const chosen = await Collection.find({ type: "chosen" }).sort({ order: 1 }).populate(populate);
  if (!chosen.length) {
    return null;
  }
  const index = chosen.findIndex((collection) => collection.slug === slug);
  const next = chosen[(index + 1) % chosen.length];
  return next.slug === slug ? null : shapeCollection(next, false);
}

async function getCollection(request, response) {
  try {
    const slug = request.params.slug;
    const user = request.user;
    let collection = null;
    if (slug.startsWith("for-you-")) {
      if (!user) {
        return response.status(401).json({ message: "Please log in first" });
      }
      collection = await madeForYouBySlug(user, slug);
    } else {
      const found = await Collection.findOne({ slug }).populate(populate);
      if (found && (found.type === "chosen" || (user && String(found.user) === String(user._id)))) {
        collection = found;
      }
    }
    if (!collection) {
      return response.status(404).json({ message: "We could not find that collection" });
    }
    const next = await findNext(slug);
    response.json({ collection: shapeCollection(collection, true), next });
  } catch (error) {
    response.status(500).json({ message: "The collection could not be loaded" });
  }
}

async function createCollection(request, response) {
  try {
    const { title, description, paintingSlugs } = request.body;
    const cleanTitle = String(title || "").trim();
    if (!cleanTitle) {
      return response.status(400).json({ message: "Give your collection a name" });
    }
    const slugs = Array.isArray(paintingSlugs) ? paintingSlugs : [];
    const paintings = await Painting.find({ slug: { $in: slugs }, status: "on-the-wall" });
    const ordered = slugs.map((slug) => paintings.find((painting) => painting.slug === slug)).filter(Boolean);
    const suffix = Math.random().toString(36).slice(2, 7);
    const collection = await Collection.create({
      slug: (makeSlug(cleanTitle) || "collection") + "-" + suffix,
      title: cleanTitle,
      line: String(description || "").trim().slice(0, 300),
      type: "mine",
      user: request.user._id,
      leadPainting: ordered.length ? ordered[0]._id : null,
      items: ordered.map((painting) => ({ painting: painting._id, note: "" }))
    });
    const full = await Collection.findById(collection._id).populate(populate);
    response.status(201).json({ collection: shapeCollection(full, true) });
  } catch (error) {
    response.status(500).json({ message: "The collection could not be made" });
  }
}

async function addPainting(request, response) {
  try {
    const collection = await Collection.findOne({ slug: request.params.slug });
    if (!collection || collection.type !== "mine" || String(collection.user) !== String(request.user._id)) {
      return response.status(403).json({ message: "Only the owner can add to this collection" });
    }
    const painting = await Painting.findOne({ slug: request.body.paintingSlug, status: "on-the-wall" });
    if (!painting) {
      return response.status(404).json({ message: "We could not find that painting" });
    }
    const already = collection.items.some((item) => String(item.painting) === String(painting._id));
    if (!already) {
      collection.items.push({ painting: painting._id, note: String(request.body.note || "").trim().slice(0, 300) });
      if (!collection.leadPainting) {
        collection.leadPainting = painting._id;
      }
      await collection.save();
    }
    const full = await Collection.findById(collection._id).populate(populate);
    response.json({ collection: shapeCollection(full, true) });
  } catch (error) {
    response.status(500).json({ message: "The painting could not be added" });
  }
}

module.exports = { listCollections, getCollection, createCollection, addPainting };
