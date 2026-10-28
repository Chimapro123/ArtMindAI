const fs = require("fs");
const path = require("path");
const Artist = require("../models/Artist");
const User = require("../models/User");
const Collection = require("../models/Collection");
const View = require("../models/View");
const Painting = require("../models/Painting");
const { readStoredImage, removeImages } = require("./saveImage");

const textFields = ["title", "artistSlug", "artist", "year", "room", "style", "medium", "surface", "whereItHangs", "story", "licence", "sourceUrl"];
const numberFields = ["widthCm", "heightCm"];
const jsonFields = ["tags", "colours", "lookCloser"];

function parseJsonField(value, fallback) {
  if (Array.isArray(value)) {
    return value;
  }
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : fallback;
  } catch (error) {
    return fallback;
  }
}

async function readFields(body) {
  const fields = {};
  textFields.forEach((key) => {
    if (body[key] !== undefined) {
      fields[key] = String(body[key]).trim();
    }
  });
  numberFields.forEach((key) => {
    if (body[key] !== undefined && body[key] !== "") {
      fields[key] = Number(body[key]) || 0;
    }
  });
  jsonFields.forEach((key) => {
    if (body[key] !== undefined) {
      fields[key] = parseJsonField(body[key], []);
    }
  });
  if (fields.year !== undefined) {
    const digits = fields.year.match(/\d{3,4}/);
    fields.yearValue = digits ? parseInt(digits[0], 10) : 0;
  }
  if (body.status === "on-the-wall" || body.status === "in-storage") {
    fields.status = body.status;
  }
  if (fields.artistSlug) {
    const artist = await Artist.findOne({ slug: fields.artistSlug });
    if (artist) {
      fields.artist = artist.name;
    }
  }
  return fields;
}

function imageFileFor(painting) {
  const imagePath = painting.image || "";
  const publicPath = imagePath.startsWith("/") ? imagePath.slice(1) : imagePath;
  return path.join(__dirname, "..", "..", "client", "public", publicPath);
}

async function readPaintingImage(painting) {
  if ((painting.image || "").startsWith("/api/images/")) {
    return readStoredImage(painting.image);
  }
  const file = imageFileFor(painting);
  return fs.existsSync(file) ? fs.readFileSync(file) : null;
}

async function removePaintingEverywhere(painting) {
  await User.updateMany({}, { $pull: { savedPaintings: { painting: painting._id } } });
  await Collection.updateMany({}, { $pull: { items: { painting: painting._id } } });
  await Collection.updateMany({ leadPainting: painting._id }, { $set: { leadPainting: null } });
  await View.deleteMany({ painting: painting._id });
  await Painting.deleteOne({ _id: painting._id });
  await removeImages([painting.image, painting.thumb]);
}

module.exports = { readFields, readPaintingImage, removePaintingEverywhere };
