const View = require("../models/View");
const Painting = require("../models/Painting");
const { findPigment } = require("./pigments");

function countRooms(paintings) {
  const counts = {};
  paintings.forEach((painting) => {
    if (painting.room) {
      counts[painting.room] = (counts[painting.room] || 0) + 1;
    }
  });
  const total = Object.values(counts).reduce((sum, count) => sum + count, 0);
  return Object.keys(counts)
    .map((room) => ({ room, count: counts[room], percent: total ? Math.round((counts[room] / total) * 100) : 0 }))
    .sort((first, second) => second.count - first.count);
}

function countColours(paintings) {
  const sums = {};
  paintings.forEach((painting) => {
    (painting.colours || []).forEach((colour) => {
      sums[colour.name] = (sums[colour.name] || 0) + colour.percent;
    });
  });
  const total = Object.values(sums).reduce((sum, value) => sum + value, 0);
  return Object.keys(sums)
    .map((name) => {
      const pigment = findPigment(name);
      return { name, hex: pigment ? pigment.hex : "#888888", percent: total ? Math.round((sums[name] / total) * 100) : 0 };
    })
    .sort((first, second) => second.percent - first.percent);
}

async function getTaste(user) {
  const views = await View.find({ user: user._id }).sort({ createdAt: -1 }).limit(200).populate("painting");
  const savedIds = user.savedPaintings.map((item) => item.painting);
  const savedPaintings = await Painting.find({ _id: { $in: savedIds } });
  const viewedPaintings = views.map((view) => view.painting).filter(Boolean);
  const everything = [...viewedPaintings, ...savedPaintings];
  const rooms = countRooms(everything);
  const colours = countColours(everything);
  const pickedRoom = user.rooms && user.rooms.length ? user.rooms[0] : "Landscape";
  return {
    rooms,
    colours,
    topRoom: rooms.length ? rooms[0].room : pickedRoom,
    topColour: colours.length ? colours[0].name : "Ultramarine",
    hasActivity: everything.length > 0,
    views,
    viewedIds: [...new Set(viewedPaintings.map((painting) => String(painting._id)))],
    savedIds: savedIds.map((id) => String(id)),
    savedPaintings,
    viewedPaintings
  };
}

module.exports = { getTaste };
