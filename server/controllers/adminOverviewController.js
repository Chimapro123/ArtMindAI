const Visit = require("../models/Visit");
const View = require("../models/View");
const Search = require("../models/Search");
const User = require("../models/User");
const Painting = require("../models/Painting");
const { shapePainting } = require("../utils/shapePainting");
const { countByDay, roomShares, makeNotes } = require("../utils/overviewHelpers");

const rangeDays = { week: 7, month: 30, year: 365 };

function change(now, before) {
  if (!before) {
    return now ? 100 : 0;
  }
  return Math.round(((now - before) / before) * 100);
}

async function countSaves(from, to) {
  const rows = await User.aggregate([
    { $unwind: "$savedPaintings" },
    { $match: { "savedPaintings.savedAt": { $gte: from, $lt: to } } },
    { $count: "count" }
  ]);
  return rows.length ? rows[0].count : 0;
}

async function mostLookedAt(start, paintings) {
  const rows = await View.aggregate([
    { $match: { createdAt: { $gte: start } } },
    { $group: { _id: "$painting", views: { $sum: 1 } } },
    { $sort: { views: -1 } },
    { $limit: 5 }
  ]);
  return rows
    .map((row) => {
      const painting = paintings.find((item) => String(item._id) === String(row._id));
      return painting ? { painting: shapePainting(painting), views: row.views, saves: painting.saves } : null;
    })
    .filter(Boolean);
}

async function topSearches(start) {
  const rows = await Search.aggregate([
    { $match: { createdAt: { $gte: start } } },
    { $group: { _id: { $toLower: "$sentence" }, count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: 5 }
  ]);
  return rows.map((row) => ({ sentence: row._id, count: row.count }));
}

async function getOverview(request, response) {
  try {
    const range = rangeDays[request.query.range] ? request.query.range : "week";
    const days = rangeDays[range];
    const now = new Date();
    const start = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
    const before = new Date(start.getTime() - days * 24 * 60 * 60 * 1000);
    const visits = await Visit.countDocuments({ createdAt: { $gte: start } });
    const visitsBefore = await Visit.countDocuments({ createdAt: { $gte: before, $lt: start } });
    const saves = await countSaves(start, now);
    const savesBefore = await countSaves(before, start);
    const searches = await Search.countDocuments({ createdAt: { $gte: start } });
    const searchesBefore = await Search.countDocuments({ createdAt: { $gte: before, $lt: start } });
    const newPasses = await User.countDocuments({ createdAt: { $gte: start }, isVerified: true });
    const passesBefore = await User.countDocuments({ createdAt: { $gte: before, $lt: start }, isVerified: true });
    const paintings = await Painting.find({});
    const views = await View.find({ createdAt: { $gte: start } }).populate("painting", "room");
    const visitsByDay = await countByDay(start, days);
    const timeInRooms = roomShares(views);
    const looked = await mostLookedAt(start, paintings);
    const searchedFor = await topSearches(start);
    const numbers = { visits, visitsChange: change(visits, visitsBefore), range, timeInRooms, looked, searchedFor };
    response.json({
      visits,
      visitsChange: change(visits, visitsBefore),
      saves,
      savesChange: change(saves, savesBefore),
      searches,
      searchesChange: change(searches, searchesBefore),
      newPasses,
      newPassesChange: change(newPasses, passesBefore),
      visitsByDay,
      timeInRooms,
      mostLookedAt: looked,
      searchedFor,
      notes: makeNotes(numbers)
    });
  } catch (error) {
    response.status(500).json({ message: "The overview could not be loaded" });
  }
}

module.exports = { getOverview };
