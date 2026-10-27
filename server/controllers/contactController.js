const crypto = require("crypto");
const Message = require("../models/Message");
const Subscriber = require("../models/Subscriber");
const Visit = require("../models/Visit");
const { goodEmail } = require("../utils/shapeUser");
const { dayKey } = require("../utils/friendlyTime");

async function sendMessage(request, response) {
  try {
    const { name, email, subject, message, sendCopy } = request.body;
    const cleanName = String(name || "").trim();
    const cleanEmail = String(email || "").trim().toLowerCase();
    const cleanMessage = String(message || "").trim();
    if (!cleanName || !cleanEmail || !cleanMessage) {
      return response.status(400).json({ message: "Please fill in your name, email and message" });
    }
    if (!goodEmail(cleanEmail)) {
      return response.status(400).json({ message: "That email does not look right" });
    }
    await Message.create({
      name: cleanName,
      email: cleanEmail,
      subject: String(subject || "").trim().slice(0, 100),
      message: cleanMessage.slice(0, 3000),
      sendCopy: Boolean(sendCopy)
    });
    response.json({ message: "Thanks, we've got your message." });
  } catch (error) {
    response.status(500).json({ message: "Your message could not be sent. Please try again" });
  }
}

async function subscribe(request, response) {
  try {
    const email = String(request.body.email || "").trim().toLowerCase();
    if (!goodEmail(email)) {
      return response.status(400).json({ message: "That email does not look right" });
    }
    await Subscriber.updateOne({ email }, { $setOnInsert: { email, createdAt: new Date() } }, { upsert: true });
    response.json({ message: "Thank you. See you on Sunday." });
  } catch (error) {
    response.status(500).json({ message: "That could not be saved. Please try again" });
  }
}

async function recordVisit(request, response) {
  try {
    let visitorId = request.cookies.visitor;
    if (!visitorId || !/^[a-f0-9]{32}$/.test(visitorId)) {
      visitorId = crypto.randomBytes(16).toString("hex");
      response.cookie("visitor", visitorId, {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        maxAge: 365 * 24 * 60 * 60 * 1000
      });
    }
    const day = dayKey(new Date());
    const page = String(request.body.page || "/").slice(0, 200);
    await Visit.updateOne(
      { visitorId, day },
      { $setOnInsert: { visitorId, day, page, user: request.user ? request.user._id : null, createdAt: new Date() } },
      { upsert: true }
    );
    response.json({ ok: true });
  } catch (error) {
    response.json({ ok: true });
  }
}

module.exports = { sendMessage, subscribe, recordVisit };
