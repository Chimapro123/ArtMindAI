const bcrypt = require("bcryptjs");
const User = require("../models/User");

async function seedDemo() {
  const email = String(process.env.DEMO_EMAIL || "").trim().toLowerCase();
  if (!email || !process.env.DEMO_PASSWORD) {
    console.log("No demo email or password in .env, so no demo member was made");
    return;
  }
  const password = await bcrypt.hash(process.env.DEMO_PASSWORD, 10);
  await User.updateOne(
    { email },
    {
      $set: { name: "Ada Obi", role: "member", isVerified: true, rooms: ["Landscape", "Figurative"] },
      $setOnInsert: { email, password, createdAt: new Date() }
    },
    { upsert: true }
  );
  console.log("Demo member is ready");
}

module.exports = seedDemo;
