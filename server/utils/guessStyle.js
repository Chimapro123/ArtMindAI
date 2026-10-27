const { roomNames } = require("./shapeUser");
const { styleNames } = require("./wordLists");

function share(colours, names) {
  return colours.filter((colour) => names.includes(colour.name)).reduce((sum, colour) => sum + colour.percent, 0);
}

function guessFromColours(colours) {
  const greens = share(colours, ["Viridian", "Sap green", "Terre verte"]);
  const blues = share(colours, ["Ultramarine", "Prussian blue", "Cerulean"]);
  const darks = share(colours, ["Ivory black", "Burnt umber", "Payne's grey"]);
  const golds = share(colours, ["Yellow ochre", "Naples yellow"]);
  const pinks = share(colours, ["Rose madder", "Vermilion", "Venetian red"]);
  const pales = share(colours, ["Lead white", "Bone"]);
  let guess = { style: "Realism", room: "Figurative", mood: "Still and thoughtful" };
  if (greens + blues > 45) {
    guess = { style: "Romanticism", room: "Landscape", mood: "Open and airy" };
  } else if (darks > 50) {
    guess = { style: "Baroque", room: "Figurative", mood: "Dark and dramatic" };
  } else if (golds > 35) {
    guess = { style: "Gothic", room: "Religious", mood: "Warm and glowing" };
  } else if (pinks > 25 && pales > 15) {
    guess = { style: "Baroque", room: "Flower", mood: "Bright and busy" };
  } else if (colours.length <= 3 && pinks + blues + golds > 50) {
    guess = { style: "Modern", room: "Abstract", mood: "Bold and simple" };
  }
  const others = styleNames.filter((style) => style !== guess.style).slice(0, 2);
  return {
    style: guess.style,
    confidence: 40,
    otherStyles: [
      { style: others[0], confidence: 25 },
      { style: others[1], confidence: 15 }
    ],
    room: guess.room,
    mood: guess.mood
  };
}

function checkLook(data) {
  return styleNames.includes(data.style) && roomNames.includes(data.room) && typeof data.mood === "string";
}

function cleanLook(data) {
  const confidence = Math.min(100, Math.max(0, Math.round(Number(data.confidence) || 50)));
  const others = (Array.isArray(data.otherStyles) ? data.otherStyles : [])
    .filter((item) => item && styleNames.includes(item.style) && item.style !== data.style)
    .slice(0, 2)
    .map((item) => ({ style: item.style, confidence: Math.min(100, Math.max(0, Math.round(Number(item.confidence) || 10))) }));
  while (others.length < 2) {
    const filler = styleNames.find((style) => style !== data.style && !others.some((item) => item.style === style));
    others.push({ style: filler, confidence: 10 });
  }
  return { style: data.style, confidence, otherStyles: others, room: data.room, mood: String(data.mood).slice(0, 60) };
}

function noteFor(confidence, usedModel) {
  if (!usedModel) {
    return "The guide could not look at your photo properly, so this guess comes from the colours alone. Take it with a pinch of salt.";
  }
  if (confidence >= 70) {
    return "The guide is fairly sure about this one, but a photo of a painting is never the painting itself.";
  }
  if (confidence >= 50) {
    return "The guide is not very sure, so treat this as a starting point rather than an answer.";
  }
  return "This is only a guess. The photo might be dark, blurred or too close to tell.";
}

module.exports = { guessFromColours, checkLook, cleanLook, noteFor };
