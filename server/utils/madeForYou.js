const Painting = require("../models/Painting");
const { getTaste } = require("./taste");
const { findPigment } = require("./pigments");

const roomTitles = {
  Abstract: "Colour and shape",
  Landscape: "Quiet fields",
  Flower: "Fresh from the garden",
  Nature: "Wild things",
  Figurative: "Faces and letters",
  Religious: "Gold and prayer"
};

function makeOne(slug, title, line, paintings, userId) {
  return {
    slug,
    title,
    line,
    type: "made-for-you",
    user: userId,
    leadPainting: paintings[0] || null,
    items: paintings.map((painting) => ({ painting, note: "", x: null, y: null })),
    createdAt: new Date()
  };
}

async function roomCollection(taste, user) {
  const room = taste.topRoom;
  const paintings = await Painting.find({ status: "on-the-wall", room }).sort({ views: -1 }).limit(6);
  const line = taste.hasActivity
    ? "Built from the room you spend the most time in, the " + room + " room."
    : "Built from the rooms you told us you like.";
  return makeOne("for-you-room", roomTitles[room] || "Your " + room + " room", line, paintings, user._id);
}

async function colourCollection(taste, user) {
  const name = taste.topColour;
  const pigment = findPigment(name);
  const paintings = await Painting.find({ status: "on-the-wall", "colours.name": name }).sort({ views: -1 }).limit(12);
  const sorted = paintings
    .map((painting) => {
      const colour = painting.colours.find((item) => item.name === name);
      return { painting, percent: colour ? colour.percent : 0 };
    })
    .sort((first, second) => second.percent - first.percent)
    .slice(0, 6)
    .map((item) => item.painting);
  const title = pigment ? pigment.title : "Your " + name.toLowerCase() + " room";
  const line = taste.hasActivity
    ? "Built from the colour you keep coming back to, " + name.toLowerCase() + "."
    : "A few paintings full of " + name.toLowerCase() + " to get you started.";
  return makeOne("for-you-colour", title, line, sorted, user._id);
}

async function madeForYou(user) {
  const taste = await getTaste(user);
  const room = await roomCollection(taste, user);
  const colour = await colourCollection(taste, user);
  return [room, colour];
}

async function madeForYouBySlug(user, slug) {
  const both = await madeForYou(user);
  return both.find((collection) => collection.slug === slug) || null;
}

module.exports = { madeForYou, madeForYouBySlug };
