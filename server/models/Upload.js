const mongoose = require("mongoose");

const uploadSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  image: { type: String, required: true },
  result: { type: mongoose.Schema.Types.Mixed, default: {} },
  createdAt: { type: Date, default: Date.now }
});

uploadSchema.index({ user: 1, createdAt: -1 });

module.exports = mongoose.model("Upload", uploadSchema);
