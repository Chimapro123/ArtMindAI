const Painting = require("../models/Painting");
const Upload = require("../models/Upload");
const getColours = require("../utils/getColours");
const { askImage } = require("../utils/askModel");
const { saveLabPhoto } = require("../utils/saveImage");
const { shapePainting } = require("../utils/shapePainting");
const { guessFromColours, checkLook, cleanLook, noteFor } = require("../utils/guessStyle");
const { roomNames } = require("../utils/shapeUser");
const { styleNames } = require("../utils/wordLists");

const system =
  "You look at a photo of a painting for a small gallery and say what it most likely is. Styles you can choose from: " + styleNames.join(", ") + ". " +
  "Rooms you can choose from: " + roomNames.join(", ") + ". " +
  "Give a JSON object with style, confidence (0 to 100), otherStyles (two objects with style and confidence), room, and mood (a few plain words like Still and thoughtful).";

function closestPaintings(look, colours, paintings) {
  const names = colours.slice(0, 3).map((colour) => colour.name);
  return paintings
    .map((painting) => {
      const reasons = [];
      let score = 0;
      if (painting.style === look.style) {
        score += 3;
        reasons.push("same style");
      }
      if (painting.room === look.room) {
        score += 2;
        reasons.push("same room");
      }
      const shared = (painting.colours || []).slice(0, 4).filter((colour) => names.includes(colour.name)).map((colour) => colour.name.toLowerCase());
      if (shared.length) {
        score += shared.length;
        reasons.push("shares its " + shared.slice(0, 2).join(" and "));
      }
      const reason = reasons.length ? reasons.join(", ").replace(/^./, (letter) => letter.toUpperCase()) + "." : "";
      return { painting, score, reason };
    })
    .filter((item) => item.score > 0)
    .sort((first, second) => second.score - first.score || second.painting.views - first.painting.views)
    .slice(0, 4);
}

function shapeResult(upload, paintings) {
  const result = upload.result || {};
  return {
    id: String(upload._id),
    image: upload.image,
    style: result.style,
    confidence: result.confidence,
    otherStyles: result.otherStyles || [],
    room: result.room,
    mood: result.mood,
    colours: result.colours || [],
    closest: (result.closest || [])
      .map((item) => ({ painting: shapePainting(paintings.find((painting) => painting.slug === item.slug)), reason: item.reason }))
      .filter((item) => item.painting),
    note: result.note,
    checkedAt: upload.createdAt
  };
}

async function checkImage(request, response) {
  try {
    if (!request.file) {
      return response.status(400).json({ message: "Please choose a JPG or PNG photo" });
    }
    const buffer = request.file.buffer;
    const colours = await getColours(buffer, 5);
    const fromModel = await askImage(buffer, "What painting style is this most likely to be?", system, checkLook, { maxTokens: 800, temperature: 0.3 });
    const look = fromModel ? cleanLook(fromModel) : guessFromColours(colours);
    const paintings = await Painting.find({ status: "on-the-wall" });
    const closest = closestPaintings(look, colours, paintings);
    const image = await saveLabPhoto(buffer, String(request.user._id));
    const upload = await Upload.create({
      user: request.user._id,
      image,
      result: {
        ...look,
        colours,
        closest: closest.map((item) => ({ slug: item.painting.slug, reason: item.reason })),
        note: noteFor(look.confidence, Boolean(fromModel))
      }
    });
    response.json({ result: shapeResult(upload, paintings) });
  } catch (error) {
    response.status(500).json({ message: "That photo could not be checked. Please try another one" });
  }
}

async function history(request, response) {
  try {
    const uploads = await Upload.find({ user: request.user._id }).sort({ createdAt: -1 }).limit(4);
    const slugs = [...new Set(uploads.flatMap((upload) => (upload.result.closest || []).map((item) => item.slug)))];
    const paintings = await Painting.find({ slug: { $in: slugs } });
    const items = uploads.map((upload) => shapeResult(upload, paintings));
    response.json({ items, total: items.length, page: 1, pages: 1 });
  } catch (error) {
    response.status(500).json({ message: "Your earlier photos could not be loaded" });
  }
}

module.exports = { checkImage, history };
