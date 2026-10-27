const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    from: { type: String, enum: ["visitor", "guide"], required: true },
    text: { type: String, default: "" },
    paintings: { type: [String], default: [] },
    sentAt: { type: Date, default: Date.now }
  },
  { _id: false }
);

const conversationSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, default: "New conversation" },
    messages: { type: [messageSchema], default: [] }
  },
  { timestamps: true }
);

conversationSchema.index({ user: 1, updatedAt: -1 });

module.exports = mongoose.model("Conversation", conversationSchema);
