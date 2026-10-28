const Visit = require("../models/Visit");
const { dayKey, shortDay, monthNames } = require("./friendlyTime");

async function countByDay(start, days) {
  const rows = await Visit.aggregate([
    { $match: { createdAt: { $gte: start } } },
    { $group: { _id: "$day", count: { $sum: 1 } } }
  ]);
  const counts = {};
  rows.forEach((row) => {
    counts[row._id] = row.count;
  });
  if (days > 60) {
    const byMonth = {};
    const order = [];
    for (let index = days - 1; index >= 0; index -= 1) {
      const date = new Date(Date.now() - index * 24 * 60 * 60 * 1000);
      const label = monthNames[date.getMonth()].slice(0, 3) + " " + date.getFullYear();
      if (byMonth[label] === undefined) {
        byMonth[label] = 0;
        order.push(label);
      }
      byMonth[label] += counts[dayKey(date)] || 0;
    }
    return order.map((label) => ({ day: label, count: byMonth[label] }));
  }
  const list = [];
  for (let index = days - 1; index >= 0; index -= 1) {
    const date = new Date(Date.now() - index * 24 * 60 * 60 * 1000);
    list.push({ day: shortDay(date), count: counts[dayKey(date)] || 0 });
  }
  return list;
}

function roomShares(views) {
  const counts = {};
  let total = 0;
  views.forEach((view) => {
    const room = view.painting && view.painting.room;
    if (room) {
      counts[room] = (counts[room] || 0) + 1;
      total += 1;
    }
  });
  return Object.keys(counts)
    .map((room) => ({ room, percent: Math.round((counts[room] / total) * 100) }))
    .sort((first, second) => second.percent - first.percent);
}

function makeNotes(numbers) {
  const period = numbers.range === "week" ? "week" : numbers.range === "month" ? "month" : "year";
  const notes = [];
  if (numbers.visitsChange > 0) {
    notes.push("Visits are up " + numbers.visitsChange + "% on the " + period + " before.");
  } else if (numbers.visitsChange < 0) {
    notes.push("Visits are down " + Math.abs(numbers.visitsChange) + "% on the " + period + " before.");
  } else {
    notes.push("Visits are about the same as the " + period + " before, at " + numbers.visits + ".");
  }
  if (numbers.timeInRooms.length) {
    const top = numbers.timeInRooms[0];
    notes.push("The " + top.room + " room had the most time, with " + top.percent + "% of all views.");
  } else {
    notes.push("Nobody has opened a painting yet this " + period + ".");
  }
  if (numbers.looked.length) {
    const top = numbers.looked[0];
    notes.push(top.painting.title + " was looked at most, " + top.views + (top.views === 1 ? " time." : " times."));
  } else if (numbers.searchedFor.length) {
    notes.push("The most typed search was \"" + numbers.searchedFor[0].sentence + "\".");
  } else {
    notes.push("No painting stands out yet. Give it a few more days.");
  }
  return notes;
}

module.exports = { countByDay, roomShares, makeNotes };
