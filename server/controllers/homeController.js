const Painting = require("../models/Painting");
const View = require("../models/View");
const { shapePainting } = require("../utils/shapePainting");
const { homePigments, findPigment } = require("../utils/pigments");
const { rooms, timeline, heroSlug, lookCloserSlug, regularSlug } = require("../utils/homeData");

async function mainWall(paintings) {
  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const counts = await View.aggregate([
    { $match: { createdAt: { $gte: weekAgo } } },
    { $group: { _id: "$painting", count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: 5 }
  ]);
  const wall = counts.map((row) => paintings.find((painting) => String(painting._id) === String(row._id))).filter(Boolean);
  const byViews = [...paintings].sort((first, second) => second.views - first.views);
  byViews.forEach((painting) => {
    if (wall.length < 5 && !wall.includes(painting)) {
      wall.push(painting);
    }
  });
  return wall;
}

function colourRows(paintings) {
  return homePigments.map((name) => {
    const pigment = findPigment(name);
    const withColour = paintings
      .map((painting) => {
        const colour = painting.colours.find((item) => item.name === name);
        return { painting, percent: colour ? colour.percent : 0 };
      })
      .filter((item) => item.percent > 0)
      .sort((first, second) => second.percent - first.percent)
      .slice(0, 6)
      .map((item) => shapePainting(item.painting));
    return { name, hex: pigment.hex, paintings: withColour };
  });
}

async function getHome(request, response) {
  try {
    const paintings = await Painting.find({ status: "on-the-wall" });
    const bySlug = (slug) => paintings.find((painting) => painting.slug === slug) || null;
    const wall = await mainWall(paintings);
    response.json({
      hero: shapePainting(bySlug(heroSlug) || paintings[0]),
      rooms: rooms.map((room) => ({ name: room.name, description: room.description, painting: shapePainting(bySlug(room.slug)) })),
      mainWall: wall.map(shapePainting),
      lookCloser: shapePainting(bySlug(lookCloserSlug)),
      colours: colourRows(paintings),
      throughTime: timeline.map((stop) => ({ style: stop.style, era: stop.era, painting: shapePainting(bySlug(stop.slug)) })),
      regular: shapePainting(bySlug(regularSlug)),
      count: paintings.length
    });
  } catch (error) {
    response.status(500).json({ message: "The home page could not be loaded" });
  }
}

module.exports = { getHome };
