const Painting = require("../models/Painting");
const Search = require("../models/Search");
const { askJson } = require("../utils/askModel");
const { readSentence } = require("../utils/readSentence");
const { rankPaintings } = require("../utils/scoreSearch");
const { shapePainting } = require("../utils/shapePainting");
const { roomNames } = require("../utils/shapeUser");
const { styleNames, mediumNames, colourWords } = require("../utils/wordLists");
const { pigments } = require("../utils/pigments");

const suggestions = ["a stormy sea in the 1800s", "gold, gold and more gold", "a painting with a dog in it somewhere", "something blue and calm"];

const system =
  "You read what a visitor types into the search box of a small painting gallery and pull out what they want. " +
  "Rooms: " + roomNames.join(", ") + ". " +
  "Colours, use these exact names: " + pigments.map((pigment) => pigment.name).join(", ") + ". " +
  "Turn plain colour words into those names, so blue is Ultramarine, red is Vermilion, gold or yellow is Yellow ochre, green is Viridian, white is Lead white, black is Ivory black, brown is Burnt umber, pink is Rose madder and grey is Slate grey. " +
  "Moods: calm, stormy, dramatic, joyful, dark, dreamy. Styles: " + styleNames.join(", ") + ". Media: " + mediumNames.join(", ") + ". " +
  "Give a JSON object with room (one room or empty), colours (list), moods (list), subjects (list of one word things to look for, like dog, sea, letter, mountain, gold), style (or empty), medium (or empty), fromYear and toYear (numbers or null). Leave out anything the visitor did not mean.";

function checkWants(data) {
  return typeof data === "object" && (Array.isArray(data.subjects) || Array.isArray(data.colours) || typeof data.room === "string");
}

function toPigment(word) {
  const lower = String(word || "").toLowerCase().trim();
  const byName = pigments.find((pigment) => pigment.name.toLowerCase() === lower);
  if (byName) {
    return byName.name;
  }
  return Object.keys(colourWords).find((name) => colourWords[name].includes(lower)) || null;
}

function cleanWants(data) {
  const colours = [];
  const extraSubjects = [];
  (Array.isArray(data.colours) ? data.colours : []).forEach((word) => {
    const pigment = toPigment(word);
    if (pigment && !colours.includes(pigment)) {
      colours.push(pigment);
    } else if (!pigment && String(word).trim()) {
      extraSubjects.push(String(word).toLowerCase().trim());
    }
  });
  const subjects = (Array.isArray(data.subjects) ? data.subjects : []).map((word) => String(word).toLowerCase().trim()).filter(Boolean);
  return {
    room: roomNames.includes(data.room) ? data.room : "",
    colours,
    moods: (Array.isArray(data.moods) ? data.moods : []).map((mood) => String(mood).toLowerCase()).slice(0, 3),
    subjects: [...new Set([...subjects, ...extraSubjects])].slice(0, 5),
    style: styleNames.includes(data.style) ? data.style : "",
    medium: mediumNames.includes(data.medium) ? data.medium : "",
    fromYear: Number(data.fromYear) || null,
    toYear: Number(data.toYear) || null
  };
}

function partsFrom(wants) {
  const parts = [];
  if (wants.room) {
    parts.push({ text: wants.room.toLowerCase(), type: "room" });
  }
  wants.colours.forEach((name) => parts.push({ text: name.toLowerCase(), type: "colour" }));
  wants.moods.forEach((mood) => parts.push({ text: mood, type: "mood" }));
  wants.subjects.forEach((word) => parts.push({ text: word, type: "subject" }));
  if (wants.style) {
    parts.push({ text: wants.style.toLowerCase(), type: "style" });
  }
  if (wants.medium) {
    parts.push({ text: wants.medium.toLowerCase(), type: "medium" });
  }
  if (wants.fromYear) {
    parts.push({ text: wants.toYear ? wants.fromYear + " to " + wants.toYear : "after " + wants.fromYear, type: "time" });
  }
  return parts;
}

async function understand(sentence) {
  const fromModel = await askJson("The visitor typed: " + sentence, system, checkWants, { temperature: 0.2, maxTokens: 800 });
  if (fromModel) {
    const wants = cleanWants(fromModel);
    const parts = partsFrom(wants);
    if (parts.length) {
      return { wants, parts };
    }
  }
  return readSentence(sentence);
}

async function search(request, response) {
  try {
    const sentence = String(request.body.sentence || "").trim().slice(0, 200);
    if (!sentence) {
      return response.status(400).json({ message: "Type a few words first" });
    }
    const { wants, parts } = await understand(sentence);
    const paintings = await Painting.find({ status: "on-the-wall" });
    const ranked = rankPaintings(paintings, wants).slice(0, 24);
    const items = ranked.map((item) => ({ ...shapePainting(item.painting), why: item.why }));
    await Search.create({ user: request.user ? request.user._id : null, sentence, parts, resultCount: items.length });
    response.json({ items, total: items.length, page: 1, pages: 1, parts, suggestions });
  } catch (error) {
    response.status(500).json({ message: "The search could not run. Please try again" });
  }
}

module.exports = { search };
