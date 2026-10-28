const mongoose = require("mongoose");

const imageSchema = new mongoose.Schema({
  data: { type: Buffer, required: true },
  contentType: { type: String, default: "image/jpeg" },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
  createdAt: { type: Date, default: Date.now }
});

imageSchema.index({ owner: 1 });

module.exports = mongoose.model("Image", imageSchema);
