const mongoose = require("mongoose");

const partSchema = new mongoose.Schema(
  {
    text: String,
    type: String
  },
  { _id: false }
);

const searchSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
  sentence: { type: String, required: true },
  parts: { type: [partSchema], default: [] },
  resultCount: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

searchSchema.index({ createdAt: -1 });

module.exports = mongoose.model("Search", searchSchema);
