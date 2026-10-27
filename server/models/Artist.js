const mongoose = require("mongoose");

const lifeStopSchema = new mongoose.Schema(
  {
    year: Number,
    text: String
  },
  { _id: false }
);

const artistSchema = new mongoose.Schema({
  slug: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  born: { type: Number, default: null },
  died: { type: Number, default: null },
  nationality: { type: String, default: "" },
  era: { type: String, default: "" },
  letter: { type: String, default: "" },
  portrait: { type: String, default: "" },
  portraitLicence: { type: String, default: null },
  portraitSourceUrl: { type: String, default: null },
  bio: { type: String, default: "" },
  lifeStops: { type: [lifeStopSchema], default: [] },
  quote: { type: String, default: "" },
  quoteSource: { type: String, default: "" },
  spotlightLine: { type: String, default: "" }
});

module.exports = mongoose.model("Artist", artistSchema);
