const Painting = require("../models/Painting");
const getColours = require("../utils/getColours");
const { shapePainting, pageList, readPage } = require("../utils/shapePainting");
const { savePaintingImages, removeImages } = require("../utils/saveImage");
const { uniqueSlug } = require("../utils/makeSlug");
const { readFields, removePaintingEverywhere } = require("../utils/paintingFields");
const { tagsFor } = require("../utils/paintingTags");

function labelledFilter(labels) {
  if (labels === "labelled") {
    return { style: { $ne: "" }, room: { $ne: "" }, "colours.0": { $exists: true }, "tags.0": { $exists: true } };
  }
  if (labels === "needs-labels") {
    return { $or: [{ style: "" }, { room: "" }, { colours: { $size: 0 } }, { tags: { $size: 0 } }] };
  }
  return {};
}

async function listPaintings(request, response) {
  try {
    const { page, limit, skip } = readPage(request.query);
    const filter = labelledFilter(request.query.labels);
    if (request.query.search) {
      const text = String(request.query.search).trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      filter.$and = [{ $or: [{ title: { $regex: text, $options: "i" } }, { artist: { $regex: text, $options: "i" } }] }];
    }
    if (request.query.room) {
      filter.room = request.query.room;
    }
    if (request.query.status === "on-the-wall" || request.query.status === "in-storage") {
      filter.status = request.query.status;
    }
    const total = await Painting.countDocuments(filter);
    const paintings = await Painting.find(filter).sort({ createdAt: -1, title: 1 }).skip(skip).limit(limit);
    const inStorage = await Painting.countDocuments({ status: "in-storage" });
    response.json({ ...pageList(paintings.map(shapePainting), total, page, limit), inStorage });
  } catch (error) {
    response.status(500).json({ message: "The paintings could not be loaded" });
  }
}

async function getPainting(request, response) {
  try {
    const painting = await Painting.findOne({ slug: request.params.slug });
    if (!painting) {
      return response.status(404).json({ message: "We could not find that painting" });
    }
    response.json({ painting: shapePainting(painting) });
  } catch (error) {
    response.status(500).json({ message: "The painting could not be loaded" });
  }
}

async function createPainting(request, response) {
  try {
    if (!request.file) {
      return response.status(400).json({ message: "Please choose an image for the painting" });
    }
    const fields = await readFields(request.body);
    const title = fields.title || "Untitled";
    const slug = await uniqueSlug(Painting, title);
    const images = await savePaintingImages(request.file.buffer);
    if (!fields.colours || !fields.colours.length) {
      fields.colours = await getColours(request.file.buffer, 5);
    }
    const painting = await Painting.create({
      ...fields,
      title,
      slug,
      image: images.image,
      thumb: images.thumb,
      status: fields.status || "in-storage"
    });
    if (!painting.tags.length) {
      painting.tags = tagsFor(painting);
      await painting.save();
    }
    response.status(201).json({ painting: shapePainting(painting) });
  } catch (error) {
    response.status(500).json({ message: "The painting could not be added" });
  }
}

async function updatePainting(request, response) {
  try {
    const painting = await Painting.findOne({ slug: request.params.slug });
    if (!painting) {
      return response.status(404).json({ message: "We could not find that painting" });
    }
    const fields = await readFields(request.body);
    const oldImages = [painting.image, painting.thumb];
    if (fields.title === "") {
      return response.status(400).json({ message: "The painting needs a title" });
    }
    Object.keys(fields).forEach((key) => {
      painting[key] = fields[key];
    });
    if (request.file) {
      const images = await savePaintingImages(request.file.buffer);
      painting.image = images.image;
      painting.thumb = images.thumb;
      if (!fields.colours) {
        painting.colours = await getColours(request.file.buffer, 5);
      }
    }
    await painting.save();
    if (request.file) {
      await removeImages(oldImages);
    }
    response.json({ painting: shapePainting(painting) });
  } catch (error) {
    response.status(500).json({ message: "The painting could not be saved" });
  }
}

async function deletePainting(request, response) {
  try {
    const painting = await Painting.findOne({ slug: request.params.slug });
    if (!painting) {
      return response.status(404).json({ message: "We could not find that painting" });
    }
    await removePaintingEverywhere(painting);
    response.json({ message: painting.title + " is gone" });
  } catch (error) {
    response.status(500).json({ message: "The painting could not be removed" });
  }
}

module.exports = { listPaintings, getPainting, createPainting, updatePainting, deletePainting };
