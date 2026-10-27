const mongoose = require("mongoose");

const colourSchema = new mongoose.Schema(
  {
    name: String,
    hex: String,
    percent: Number
  },
  { _id: false }
);

const pointSchema = new mongoose.Schema(
  {
    x: Number,
    y: Number,
    title: String,
    note: String
  },
  { _id: false }
);

const paintingSchema = new mongoose.Schema({
  slug: { type: String, required: true, unique: true },
  image: { type: String, default: "" },
  thumb: { type: String, default: "" },
  title: { type: String, required: true, trim: true },
  artist: { type: String, default: "" },
  artistSlug: { type: String, default: "" },
  year: { type: String, default: "" },
  yearValue: { type: Number, default: 0 },
  room: { type: String, default: "" },
  style: { type: String, default: "" },
  medium: { type: String, default: "" },
  surface: { type: String, default: "" },
  widthCm: { type: Number, default: 0 },
  heightCm: { type: Number, default: 0 },
  whereItHangs: { type: String, default: "" },
  licence: { type: String, default: "Public domain" },
  sourceUrl: { type: String, default: "" },
  story: { type: String, default: "" },
  tags: { type: [String], default: [] },
  colours: { type: [colourSchema], default: [] },
  lookCloser: { type: [pointSchema], default: [] },
  views: { type: Number, default: 0 },
  saves: { type: Number, default: 0 },
  status: { type: String, enum: ["on-the-wall", "in-storage"], default: "in-storage" },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Painting", paintingSchema);
