require("dotenv").config();
const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const Painting = require("./models/Painting");
const Artist = require("./models/Artist");
const Collection = require("./models/Collection");
const User = require("./models/User");
const getColours = require("./utils/getColours");
const { tagsFor } = require("./utils/paintingTags");
const defaultCollections = require("./utils/defaultCollections");

const dataFolder = path.join(__dirname, "data");
const publicFolder = path.join(__dirname, "..", "client", "public");
const paintings = JSON.parse(fs.readFileSync(path.join(dataFolder, "paintings.json"), "utf8"));
const artists = JSON.parse(fs.readFileSync(path.join(dataFolder, "artists.json"), "utf8"));
const extras = JSON.parse(fs.readFileSync(path.join(dataFolder, "extras.json"), "utf8"));

async function seedPaintings() {
  for (const painting of paintings) {
    const file = path.join(publicFolder, painting.thumb.replace(/^\//, ""));
    const colours = fs.existsSync(file) ? await getColours(file, 5) : [];
    const update = { ...painting, colours, tags: tagsFor(painting), lookCloser: extras.lookCloser[painting.slug] || [] };
    await Painting.updateOne(
      { slug: painting.slug },
      { $set: update, $setOnInsert: { status: "on-the-wall", views: 0, saves: 0, story: "", createdAt: new Date() } },
      { upsert: true }
    );
  }
  console.log("Paintings: " + paintings.length);
}

function surnameLetter(name) {
  const clean = name.replace(/\s+the\s+(Elder|Younger)$/i, "");
  const parts = clean.split(" ");
  return parts[parts.length - 1].charAt(0).toUpperCase();
}

async function seedArtists() {
  for (const artist of artists) {
    const theirs = paintings.filter((painting) => painting.artistSlug === artist.slug);
    const styles = {};
    theirs.forEach((painting) => {
      styles[painting.style] = (styles[painting.style] || 0) + 1;
    });
    const era = Object.keys(styles).sort((first, second) => styles[second] - styles[first])[0] || "";
    let portrait = artist.portrait || "";
    if (portrait && !portrait.startsWith("/")) {
      const painting = paintings.find((item) => item.slug === portrait);
      portrait = painting ? painting.thumb : "";
    }
    const extra = extras.artists[artist.slug] || {};
    const update = { ...artist, portrait, era, letter: surnameLetter(artist.name), ...extra };
    await Artist.updateOne({ slug: artist.slug }, { $set: update, $setOnInsert: { bio: "" } }, { upsert: true });
  }
  console.log("Artists: " + artists.length);
}

async function seedCollections() {
  const file = path.join(dataFolder, "collections.json");
  if (!fs.existsSync(file)) {
    fs.writeFileSync(file, JSON.stringify(defaultCollections, null, 2) + "\n");
    console.log("Wrote data/collections.json");
  }
  const collections = JSON.parse(fs.readFileSync(file, "utf8"));
  let order = 0;
  for (const collection of collections) {
    const items = [];
    for (const item of collection.items) {
      const painting = await Painting.findOne({ slug: item.painting });
      if (painting) {
        items.push({ painting: painting._id, note: item.note || "", x: item.x === undefined ? null : item.x, y: item.y === undefined ? null : item.y });
      }
    }
    const lead = await Painting.findOne({ slug: collection.lead });
    await Collection.updateOne(
      { slug: collection.slug },
      { $set: { title: collection.title, line: collection.line, type: "chosen", user: null, leadPainting: lead ? lead._id : null, items, order } },
      { upsert: true }
    );
    order += 1;
  }
  console.log("Collections: " + collections.length);
}

async function seedAdmin() {
  const email = String(process.env.ADMIN_EMAIL || "").toLowerCase();
  if (!email || !process.env.ADMIN_PASSWORD) {
    console.log("No admin email or password in .env, so no admin was made");
    return;
  }
  const password = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10);
  await User.updateOne(
    { email },
    { $set: { role: "admin", isVerified: true }, $setOnInsert: { name: "Curator", email, password, rooms: [], createdAt: new Date() } },
    { upsert: true }
  );
  console.log("Admin user is ready");
}

async function run() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    await seedPaintings();
    await seedArtists();
    await seedCollections();
    await seedAdmin();
    console.log("Seed done");
  } catch (error) {
    console.log("Seed failed: " + error.message);
  }
  await mongoose.disconnect();
}

run();
