const Artist = require("../models/Artist");
const Painting = require("../models/Painting");
const { shapePainting, shapeArtist, pageList, readPage } = require("../utils/shapePainting");

async function countPaintings() {
  const counts = await Painting.aggregate([
    { $match: { status: "on-the-wall" } },
    { $group: { _id: "$artistSlug", count: { $sum: 1 } } }
  ]);
  const byArtist = {};
  counts.forEach((row) => {
    byArtist[row._id] = row.count;
  });
  return byArtist;
}

function escapeRegex(text) {
  return String(text).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

async function listArtists(request, response) {
  try {
    const { page, limit, skip } = readPage(request.query);
    const filter = {};
    if (request.query.era) {
      filter.era = request.query.era;
    }
    if (request.query.letter) {
      filter.letter = String(request.query.letter).slice(0, 1).toUpperCase();
    }
    if (request.query.search) {
      filter.name = { $regex: escapeRegex(request.query.search.trim()), $options: "i" };
    }
    const counts = await countPaintings();
    const total = await Artist.countDocuments(filter);
    const artists = await Artist.find(filter).sort({ letter: 1, name: 1 }).skip(skip).limit(limit);
    const items = artists.map((artist) => shapeArtist(artist, counts[artist.slug]));
    const spotlightArtist = await Artist.findOne({ slug: "rachel-ruysch" });
    let spotlight = null;
    if (spotlightArtist) {
      const spotlightPaintings = await Painting.find({ artistSlug: spotlightArtist.slug, status: "on-the-wall" })
        .sort({ views: -1 })
        .limit(3);
      spotlight = { ...shapeArtist(spotlightArtist, counts[spotlightArtist.slug]), paintings: spotlightPaintings.map(shapePainting) };
    }
    response.json({ ...pageList(items, total, page, limit), spotlight });
  } catch (error) {
    response.status(500).json({ message: "The artists could not be loaded" });
  }
}

async function getArtist(request, response) {
  try {
    const artist = await Artist.findOne({ slug: request.params.slug });
    if (!artist) {
      return response.status(404).json({ message: "We could not find that artist" });
    }
    const counts = await countPaintings();
    const paintings = await Painting.find({ artistSlug: artist.slug, status: "on-the-wall" }).sort({ yearValue: 1, title: 1 });
    const mostViewed = paintings.length ? [...paintings].sort((first, second) => second.views - first.views)[0] : null;
    const sameEra = await Artist.find({ slug: { $ne: artist.slug }, era: artist.era }).limit(4);
    let related = sameEra;
    if (related.length < 4) {
      const skip = [artist.slug, ...related.map((other) => other.slug)];
      const more = await Artist.find({ slug: { $nin: skip } }).limit(4 - related.length);
      related = [...related, ...more];
    }
    response.json({
      artist: shapeArtist(artist, counts[artist.slug]),
      paintings: paintings.map(shapePainting),
      mostViewed: shapePainting(mostViewed),
      related: related.map((other) => shapeArtist(other, counts[other.slug]))
    });
  } catch (error) {
    response.status(500).json({ message: "The artist could not be loaded" });
  }
}

module.exports = { listArtists, getArtist };
