const View = require("../models/View");
const Search = require("../models/Search");
const Painting = require("../models/Painting");
const { shapePainting } = require("../utils/shapePainting");
const { countByDay, roomShares, makeNotes } = require("../utils/overviewHelpers");
const { countPeriod, countAllTime } = require("../utils/overviewCounts");

const rangeDays = { week: 7, month: 30, year: 365 };

function change(now, before) {
  if (!before) {
    return null;
  }
  return Math.round(((now - before) / before) * 100);
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
      return painting ? { painting: shapePainting(painting), views: row.views, allTimeViews: painting.views, saves: painting.saves } : null;
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
    const [figures, earlier, allTime, paintings, views, visitsByDay, searchedFor] = await Promise.all([
      countPeriod(start, now),
      countPeriod(before, start),
      countAllTime(),
      Painting.find({}),
      View.find({ createdAt: { $gte: start } }).populate("painting", "room"),
      countByDay(start, days),
      topSearches(start)
    ]);
    const changes = {};
    Object.keys(figures).forEach((key) => {
      changes[key] = change(figures[key], earlier[key]);
    });
    const timeInRooms = roomShares(views);
    const looked = await mostLookedAt(start, paintings);
    response.json({
      range,
      figures,
      changes,
      allTime,
      visitsByDay,
      timeInRooms,
      mostLookedAt: looked,
      searchedFor,
      notes: makeNotes({ visits: figures.visits, visitsChange: changes.visits, range, timeInRooms, looked, searchedFor })
    });
  } catch (error) {
    response.status(500).json({ message: "The overview could not be loaded" });
  }
}

module.exports = { getOverview };
