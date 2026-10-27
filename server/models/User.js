const mongoose = require("mongoose");

const savedSchema = new mongoose.Schema(
  {
    painting: { type: mongoose.Schema.Types.ObjectId, ref: "Painting" },
    savedAt: { type: Date, default: Date.now }
  },
  { _id: false }
);

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["member", "admin"], default: "member" },
  isVerified: { type: Boolean, default: false },
  code: { type: String, default: null },
  codeExpires: { type: Date, default: null },
  codeSentAt: { type: Date, default: null },
  bio: { type: String, default: "" },
  rooms: { type: [String], default: [] },
  photo: { type: String, default: null },
  savedPaintings: { type: [savedSchema], default: [] },
  emailLetters: { type: Boolean, default: true },
  emailNewCollections: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("User", userSchema);
