const Painting = require("../models/Painting");
const { shapePainting, pageList, readPage } = require("../utils/shapePainting");

async function listSaved(request, response) {
  try {
    const user = request.user;
    const { page, limit, skip } = readPage(request.query);
    const ids = user.savedPaintings.map((item) => item.painting);
    const filter = { _id: { $in: ids }, status: "on-the-wall" };
    if (request.query.room) {
      filter.room = request.query.room;
    }
    if (request.query.search) {
      const text = String(request.query.search).trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      filter.$or = [{ title: { $regex: text, $options: "i" } }, { artist: { $regex: text, $options: "i" } }];
    }
    const paintings = await Painting.find(filter);
    const savedAtById = {};
    user.savedPaintings.forEach((item) => {
      savedAtById[String(item.painting)] = item.savedAt;
    });
    let items = paintings.map((painting) => ({ ...shapePainting(painting), savedAt: savedAtById[String(painting._id)] }));
    if (request.query.sort === "title") {
      items.sort((first, second) => first.title.localeCompare(second.title));
    } else {
      items.sort((first, second) => new Date(second.savedAt) - new Date(first.savedAt));
    }
    const total = items.length;
    items = items.slice(skip, skip + limit);
    response.json(pageList(items, total, page, limit));
  } catch (error) {
    response.status(500).json({ message: "Your saved paintings could not be loaded" });
  }
}

async function savePainting(request, response) {
  try {
    const user = request.user;
    const painting = await Painting.findOne({ slug: request.params.slug, status: "on-the-wall" });
    if (!painting) {
      return response.status(404).json({ message: "We could not find that painting" });
    }
    const already = user.savedPaintings.some((item) => String(item.painting) === String(painting._id));
    if (!already) {
      user.savedPaintings.push({ painting: painting._id, savedAt: new Date() });
      await user.save();
      painting.saves += 1;
      await painting.save();
    }
    response.json({ saved: true, saves: painting.saves });
  } catch (error) {
    response.status(500).json({ message: "The painting could not be saved" });
  }
}

async function unsavePainting(request, response) {
  try {
    const user = request.user;
    const painting = await Painting.findOne({ slug: request.params.slug });
    if (!painting) {
      return response.status(404).json({ message: "We could not find that painting" });
    }
    const before = user.savedPaintings.length;
    user.savedPaintings = user.savedPaintings.filter((item) => String(item.painting) !== String(painting._id));
    if (user.savedPaintings.length !== before) {
      await user.save();
      painting.saves = Math.max(0, painting.saves - 1);
      await painting.save();
    }
    response.json({ saved: false, saves: painting.saves });
  } catch (error) {
    response.status(500).json({ message: "The painting could not be removed" });
  }
}

module.exports = { listSaved, savePainting, unsavePainting };
