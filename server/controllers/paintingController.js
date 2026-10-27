const Painting = require("../models/Painting");
const View = require("../models/View");
const Collection = require("../models/Collection");
const { shapePainting, pageList, readPage } = require("../utils/shapePainting");
const { findSimilar } = require("../utils/similarPaintings");

const sortOptions = {
  "most-viewed": { views: -1, title: 1 },
  "most-saved": { saves: -1, title: 1 },
  newest: { yearValue: -1, title: 1 },
  oldest: { yearValue: 1, title: 1 },
  title: { title: 1 }
};

async function buildFilter(query, user) {
  const filter = { status: "on-the-wall" };
  ["room", "style", "medium", "surface"].forEach((key) => {
    if (query[key]) {
      filter[key] = query[key];
    }
  });
  if (query.colour) {
    filter["colours.name"] = query.colour;
  }
  const fromYear = parseInt(query.fromYear, 10);
  const toYear = parseInt(query.toYear, 10);
  if (fromYear || toYear) {
    filter.yearValue = {};
    if (fromYear) {
      filter.yearValue.$gte = fromYear;
    }
    if (toYear) {
      filter.yearValue.$lte = toYear;
    }
  }
  if (query.hideSeen === "true" && user) {
    const seen = await View.distinct("painting", { user: user._id });
    filter._id = { $nin: seen };
  }
  if (query.curated === "true") {
    const chosen = await Collection.find({ type: "chosen" }).select("items.painting");
    const picks = chosen.flatMap((collection) => collection.items.map((item) => item.painting));
    filter._id = { ...(filter._id || {}), $in: picks };
  }
  return filter;
}

async function listPaintings(request, response) {
  try {
    const { page, limit, skip } = readPage(request.query);
    const filter = await buildFilter(request.query, request.user);
    const sort = sortOptions[request.query.sort] || sortOptions["most-viewed"];
    const total = await Painting.countDocuments(filter);
    const paintings = await Painting.find(filter).sort(sort).skip(skip).limit(limit);
    response.json(pageList(paintings.map(shapePainting), total, page, limit));
  } catch (error) {
    response.status(500).json({ message: "The paintings could not be loaded" });
  }
}

async function getPainting(request, response) {
  try {
    const painting = await Painting.findOne({ slug: request.params.slug, status: "on-the-wall" });
    if (!painting) {
      return response.status(404).json({ message: "We could not find that painting" });
    }
    const others = await Painting.find({ status: "on-the-wall", _id: { $ne: painting._id } });
    const related = findSimilar(painting, others, 4).map((item) => ({ ...shapePainting(item.painting), reason: item.reason }));
    const moreByArtist = others
      .filter((other) => other.artistSlug && other.artistSlug === painting.artistSlug)
      .sort((first, second) => first.yearValue - second.yearValue)
      .map(shapePainting);
    let saved = false;
    if (request.user) {
      saved = request.user.savedPaintings.some((item) => String(item.painting) === String(painting._id));
    }
    response.json({ painting: shapePainting(painting), related, moreByArtist, saved });
  } catch (error) {
    response.status(500).json({ message: "The painting could not be loaded" });
  }
}

async function viewPainting(request, response) {
  try {
    const painting = await Painting.findOneAndUpdate(
      { slug: request.params.slug },
      { $inc: { views: 1 } },
      { new: true }
    );
    if (!painting) {
      return response.status(404).json({ message: "We could not find that painting" });
    }
    await View.create({ user: request.user ? request.user._id : null, painting: painting._id });
    response.json({ views: painting.views });
  } catch (error) {
    response.status(500).json({ message: "The view could not be counted" });
  }
}

module.exports = { listPaintings, getPainting, viewPainting };
