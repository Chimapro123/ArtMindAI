const mongoose = require("mongoose");

const viewSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
  painting: { type: mongoose.Schema.Types.ObjectId, ref: "Painting", required: true },
  createdAt: { type: Date, default: Date.now }
});

viewSchema.index({ createdAt: -1 });
viewSchema.index({ user: 1, createdAt: -1 });

module.exports = mongoose.model("View", viewSchema);
