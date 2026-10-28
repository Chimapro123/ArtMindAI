const mongoose = require("mongoose");

const imageSchema = new mongoose.Schema({
  data: { type: Buffer, required: true },
  contentType: { type: String, default: "image/jpeg" },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Image", imageSchema);
