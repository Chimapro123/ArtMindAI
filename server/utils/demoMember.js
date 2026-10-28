const bcrypt = require("bcryptjs");
const User = require("../models/User");
const Painting = require("../models/Painting");
const View = require("../models/View");

const savedSlugs = [
  "the-hay-wain",
  "hunters-in-the-snow",
  "view-of-delft",
  "wheatfield-with-cypresses",
  "salisbury-cathedral-from-the-meadows",
  "the-milkmaid",
  "girl-with-a-pearl-earring",
  "girl-reading-a-letter-at-an-open-window",
  "woman-in-blue-reading-a-letter",
  "the-lacemaker"
];

const viewDays = [
  { daysAgo: 4, slugs: ["the-hay-wain", "the-starry-night", "hunters-in-the-snow", "the-harvesters"] },
  { daysAgo: 3, slugs: ["the-milkmaid", "girl-with-a-pearl-earring", "view-of-delft", "the-gleaners"] },
  { daysAgo: 2, slugs: ["wheatfield-with-cypresses", "salisbury-cathedral-from-the-meadows", "cafe-terrace-at-night", "the-lacemaker"] },
  { daysAgo: 1, slugs: ["girl-reading-a-letter-at-an-open-window", "woman-in-blue-reading-a-letter", "luncheon-of-the-boating-party", "the-hay-wain"] }
];

const oneDay = 24 * 60 * 60 * 1000;

function timeAgo(days, minutes) {
  return new Date(Date.now() - days * oneDay - minutes * 60 * 1000);
}

async function makeDemoUser(email) {
  const password = await bcrypt.hash(process.env.DEMO_PASSWORD, 10);
  await User.updateOne(
    { email },
    {
      $set: { name: "Ada Obi", role: "member", isVerified: true, rooms: ["Landscape", "Figurative"] },
      $setOnInsert: { email, password, createdAt: timeAgo(5, 0) }
    },
    { upsert: true }
  );
  return User.findOne({ email });
}

async function addSaves(user) {
  let count = 0;
  for (const [index, slug] of savedSlugs.entries()) {
    const painting = await Painting.findOne({ slug });
    const already = painting && user.savedPaintings.some((item) => String(item.painting) === String(painting._id));
    if (painting && !already) {
      user.savedPaintings.push({ painting: painting._id, savedAt: timeAgo(4 - Math.floor(index / 3), 30 + index * 7) });
      await Painting.updateOne({ _id: painting._id }, { $inc: { saves: 1 } });
      count += 1;
    }
  }
  await user.save();
  return count;
}

async function addViews(user) {
  const already = await View.countDocuments({ user: user._id });
  if (already > 0) {
    return 0;
  }
  let count = 0;
  for (const day of viewDays) {
    for (const [index, slug] of day.slugs.entries()) {
      const painting = await Painting.findOne({ slug });
      if (painting) {
        await View.create({ user: user._id, painting: painting._id, createdAt: timeAgo(day.daysAgo, 60 + index * 12) });
        await Painting.updateOne({ _id: painting._id }, { $inc: { views: 1 } });
        count += 1;
      }
    }
  }
  return count;
}

async function seedDemo() {
  const email = String(process.env.DEMO_EMAIL || "").trim().toLowerCase();
  if (!email || !process.env.DEMO_PASSWORD) {
    console.log("No demo email or password in .env, so no demo member was made");
    return;
  }
  const user = await makeDemoUser(email);
  const saves = await addSaves(user);
  const views = await addViews(user);
  console.log("Demo member is ready (" + saves + " new saves, " + views + " new views)");
}

module.exports = seedDemo;
