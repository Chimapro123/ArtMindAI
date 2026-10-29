const Visit = require("../models/Visit");
const View = require("../models/View");
const Search = require("../models/Search");
const User = require("../models/User");
const Conversation = require("../models/Conversation");
const Upload = require("../models/Upload");
const Message = require("../models/Message");
const Subscriber = require("../models/Subscriber");
const Painting = require("../models/Painting");

function between(from, to) {
  return { $gte: from, $lt: to };
}

async function sumPageViews(from, to) {
  const rows = await Visit.aggregate([
    { $match: { createdAt: between(from, to) } },
    { $group: { _id: null, total: { $sum: { $ifNull: ["$pageViews", 1] } } } }
  ]);
  return rows.length ? rows[0].total : 0;
}

async function countSaves(from, to) {
  const rows = await User.aggregate([
    { $unwind: "$savedPaintings" },
    { $match: { "savedPaintings.savedAt": between(from, to) } },
    { $count: "count" }
  ]);
  return rows.length ? rows[0].count : 0;
}

async function countQuestions(from, to) {
  const rows = await Conversation.aggregate([
    { $unwind: "$messages" },
    { $match: { "messages.from": "visitor", "messages.sentAt": between(from, to) } },
    { $count: "count" }
  ]);
  return rows.length ? rows[0].count : 0;
}

async function countPeriod(from, to) {
  const [visits, pageViews, paintingViews, saves, searches, questions, labPhotos, newPasses, messages, subscribers] = await Promise.all([
    Visit.countDocuments({ createdAt: between(from, to) }),
    sumPageViews(from, to),
    View.countDocuments({ createdAt: between(from, to) }),
    countSaves(from, to),
    Search.countDocuments({ createdAt: between(from, to) }),
    countQuestions(from, to),
    Upload.countDocuments({ createdAt: between(from, to) }),
    User.countDocuments({ createdAt: between(from, to), isVerified: true, role: "member" }),
    Message.countDocuments({ createdAt: between(from, to) }),
    Subscriber.countDocuments({ createdAt: between(from, to) })
  ]);
  return { visits, pageViews, paintingViews, saves, searches, questions, labPhotos, newPasses, messages, subscribers };
}

async function countAllTime() {
  const [members, paintingsOnWall, paintingViews, visits] = await Promise.all([
    User.countDocuments({ role: "member", isVerified: true }),
    Painting.countDocuments({ status: "on-the-wall" }),
    View.countDocuments({}),
    Visit.countDocuments({})
  ]);
  return { members, paintingsOnWall, paintingViews, visits };
}

module.exports = { countPeriod, countAllTime };
