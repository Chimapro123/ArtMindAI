const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema(
  {
    painting: { type: mongoose.Schema.Types.ObjectId, ref: "Painting" },
    note: { type: String, default: "" },
    x: { type: Number, default: null },
    y: { type: Number, default: null }
  },
  { _id: false }
);

const collectionSchema = new mongoose.Schema({
  slug: { type: String, required: true, unique: true },
  title: { type: String, required: true, trim: true },
  line: { type: String, default: "" },
  type: { type: String, enum: ["chosen", "mine"], default: "mine" },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
  leadPainting: { type: mongoose.Schema.Types.ObjectId, ref: "Painting", default: null },
  items: { type: [itemSchema], default: [] },
  order: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Collection", collectionSchema);
