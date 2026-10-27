const Painting = require("../models/Painting");

function addPicks(list, candidates, reason, howMany) {
  candidates.forEach((painting) => {
    const already = list.some((item) => item.painting.slug === painting.slug);
    if (!already && list.length < howMany) {
      list.push({ painting, reason });
    }
  });
}

async function recommend(user, taste, howMany) {
  const skip = [...taste.viewedIds, ...taste.savedIds];
  const fresh = await Painting.find({ status: "on-the-wall", _id: { $nin: skip } }).sort({ views: -1 });
  const picks = [];
  const lastViewed = taste.viewedPaintings[0];
  if (lastViewed) {
    const alike = fresh.filter((painting) => painting.room === lastViewed.room && painting.style === lastViewed.style);
    addPicks(picks, alike.slice(0, 2), "Because you lingered on " + lastViewed.title, howMany);
  }
  const lastSaved = taste.savedPaintings[taste.savedPaintings.length - 1];
  if (lastSaved) {
    const alike = fresh.filter((painting) => painting.artistSlug === lastSaved.artistSlug || painting.room === lastSaved.room);
    addPicks(picks, alike.slice(0, 2), "Because you saved " + lastSaved.title, howMany);
  }
  if (taste.hasActivity) {
    const fromRoom = fresh.filter((painting) => painting.room === taste.topRoom);
    addPicks(picks, fromRoom.slice(0, 2), "More from the " + taste.topRoom + " room, where you spend the most time", howMany);
    const withColour = fresh.filter((painting) => painting.colours.slice(0, 3).some((colour) => colour.name === taste.topColour));
    addPicks(picks, withColour.slice(0, 2), "Full of " + taste.topColour.toLowerCase() + ", which you keep coming back to", howMany);
  }
  (user.rooms || []).forEach((room) => {
    const fromRoom = fresh.filter((painting) => painting.room === room);
    addPicks(picks, fromRoom.slice(0, 2), "From the " + room + " room, which you said you like", howMany);
  });
  addPicks(picks, fresh.slice(0, howMany), "Everyone is looking at this one", howMany);
  return picks.slice(0, howMany);
}

module.exports = { recommend };
