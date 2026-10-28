const Painting = require("../models/Painting");
const getColours = require("../utils/getColours");
const { askImage, askText } = require("../utils/askModel");
const { readPaintingImage, removePaintingEverywhere } = require("../utils/paintingFields");
const { guessFromColours } = require("../utils/guessStyle");
const { tagsFor } = require("../utils/paintingTags");
const { roomNames } = require("../utils/shapeUser");
const { styleNames } = require("../utils/wordLists");
const { tidyAnswer } = require("../utils/guideHelpers");

const labelSystem =
  "You label paintings for a small gallery. Styles: " + styleNames.join(", ") + ". Rooms: " + roomNames.join(", ") + ". " +
  "Give a JSON object with style, room, and tags (five to eight plain lowercase words about what is in the picture, like dog, snow, letter).";

function checkLabels(data) {
  return styleNames.includes(data.style) && roomNames.includes(data.room) && Array.isArray(data.tags);
}

async function makeLabels(painting) {
  const buffer = await readPaintingImage(painting);
  if (!buffer) {
    return null;
  }
  const colours = await getColours(buffer, 5);
  const fromModel = await askImage(buffer, "What style and room fit this painting, and what is in it?", labelSystem, checkLabels, { maxTokens: 800, temperature: 0.3 });
  if (fromModel) {
    const tags = fromModel.tags.map((tag) => String(tag).toLowerCase().trim()).filter(Boolean).slice(0, 8);
    return { style: fromModel.style, room: fromModel.room, colours, tags };
  }
  const guess = guessFromColours(colours);
  return { style: painting.style || guess.style, room: painting.room || guess.room, colours, tags: tagsFor(painting) };
}

async function labels(request, response) {
  try {
    const painting = await Painting.findOne({ slug: request.params.slug });
    if (!painting) {
      return response.status(404).json({ message: "We could not find that painting" });
    }
    const result = await makeLabels(painting);
    if (!result) {
      return response.status(400).json({ message: "The image for this painting is missing" });
    }
    response.json(result);
  } catch (error) {
    response.status(500).json({ message: "The labels could not be made" });
  }
}

function fallbackStory(painting) {
  const size = painting.widthCm && painting.heightCm ? " It is " + painting.widthCm + " by " + painting.heightCm + " centimetres" : "";
  return (
    painting.title + " was painted by " + painting.artist + " in " + painting.year + ", in " + (painting.medium || "paint").toLowerCase() + " on " +
    (painting.surface || "canvas").toLowerCase() + "." + size + (size ? ", and it" : " It") + " hangs in " + (painting.whereItHangs || "a private collection") +
    ". We keep it in our " + painting.room + " room, with the other " + painting.style + " paintings."
  );
}

async function writeStory(painting) {
  const prompt =
    "Write three or four warm, plain sentences about this painting for a visitor who knows nothing about art. No long dashes, no lists, no headings. " +
    "Title: " + painting.title + ". Artist: " + painting.artist + ". Year: " + painting.year + ". Style: " + painting.style + ". Medium: " + painting.medium + " on " + painting.surface + ". " +
    "Size: " + painting.widthCm + " by " + painting.heightCm + " cm. Where it hangs: " + painting.whereItHangs + ". Tags: " + painting.tags.join(", ") + ".";
  const text = await askText(prompt, "You write short, friendly museum labels in plain English.", { maxTokens: 700 });
  return text ? tidyAnswer(text) : fallbackStory(painting);
}

async function story(request, response) {
  try {
    const painting = await Painting.findOne({ slug: request.params.slug });
    if (!painting) {
      return response.status(404).json({ message: "We could not find that painting" });
    }
    response.json({ story: await writeStory(painting) });
  } catch (error) {
    response.status(500).json({ message: "The story could not be written" });
  }
}

async function bulk(request, response) {
  try {
    const { action, slugs } = request.body;
    const list = Array.isArray(slugs) ? slugs.slice(0, 50) : [];
    const paintings = await Painting.find({ slug: { $in: list } });
    let count = 0;
    for (const painting of paintings) {
      if (action === "storage" || action === "wall") {
        painting.status = action === "wall" ? "on-the-wall" : "in-storage";
        await painting.save();
        count += 1;
      } else if (action === "remove") {
        await removePaintingEverywhere(painting);
        count += 1;
      } else if (action === "label") {
        const result = await makeLabels(painting);
        if (result) {
          Object.assign(painting, result);
          await painting.save();
          count += 1;
        }
      } else {
        return response.status(400).json({ message: "That action does not exist" });
      }
    }
    const words = { storage: "moved to storage", wall: "hung on the wall", remove: "removed", label: "labelled" };
    response.json({ message: count + (count === 1 ? " painting " : " paintings ") + words[action], count });
  } catch (error) {
    response.status(500).json({ message: "That could not be done. Please try again" });
  }
}

module.exports = { labels, story, bulk, writeStory };
