const Search = require("../models/Search");
const Collection = require("../models/Collection");
const { getTaste } = require("../utils/taste");
const { recommend } = require("../utils/recommend");
const { madeForYou } = require("../utils/madeForYou");
const { shapeCollection } = require("../utils/shapeCollection");
const { shapePainting } = require("../utils/shapePainting");
const { shapeUser } = require("../utils/shapeUser");
const { friendlyTime } = require("../utils/friendlyTime");

function lastPlaces(views, howMany) {
  const places = [];
  views.forEach((view) => {
    if (!view.painting) {
      return;
    }
    const already = places.some((place) => place.painting.slug === view.painting.slug);
    if (!already && places.length < howMany) {
      places.push({ painting: shapePainting(view.painting), when: friendlyTime(view.createdAt) });
    }
  });
  return places;
}

async function getDashboard(request, response) {
  try {
    const user = request.user;
    const taste = await getTaste(user);
    const searches = await Search.countDocuments({ user: user._id });
    const picks = await recommend(user, taste, 4);
    const forYou = await madeForYou(user);
    const mine = await Collection.find({ type: "mine", user: user._id })
      .sort({ createdAt: -1 })
      .populate([{ path: "items.painting" }, { path: "leadPainting" }]);
    response.json({
      user: shapeUser(user),
      counts: { lookedAt: taste.viewedIds.length, saved: taste.savedIds.length, searches },
      favouriteRoom: taste.hasActivity ? taste.topRoom : user.rooms[0] || "",
      waitingForYou: picks.map((pick) => ({ painting: shapePainting(pick.painting), reason: pick.reason })),
      whereYouHaveBeen: lastPlaces(taste.views, 6),
      taste: {
        rooms: taste.rooms.map((room) => ({ room: room.room, percent: room.percent })),
        colours: taste.colours.slice(0, 3)
      },
      collections: [...mine.map((collection) => shapeCollection(collection, false)), ...forYou.map((collection) => shapeCollection(collection, false))]
    });
  } catch (error) {
    response.status(500).json({ message: "Your room could not be loaded" });
  }
}

module.exports = { getDashboard };
