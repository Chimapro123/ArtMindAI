const mongoose = require("mongoose");

const visitSchema = new mongoose.Schema({
  visitorId: { type: String, required: true },
  day: { type: String, required: true },
  page: { type: String, default: "/" },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
  createdAt: { type: Date, default: Date.now }
});

visitSchema.index({ visitorId: 1, day: 1 }, { unique: true });
visitSchema.index({ createdAt: -1 });

module.exports = mongoose.model("Visit", visitSchema);
