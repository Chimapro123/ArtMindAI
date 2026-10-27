const bcrypt = require("bcryptjs");
const User = require("../models/User");
const { giveUserCode, checkUserCode, clearUserCode, canSendAgain } = require("../utils/makeCode");
const { goodPassword } = require("../utils/shapeUser");

const sameAnswer = "If that email has a pass, a code is on its way";

async function forgotPassword(request, response) {
  try {
    const email = String(request.body.email || "").trim().toLowerCase();
    if (!email) {
      return response.status(400).json({ message: "Please type your email" });
    }
    const user = await User.findOne({ email });
    if (user && user.isVerified && canSendAgain(user)) {
      await giveUserCode(user, "reset");
    }
    response.json({ message: sameAnswer });
  } catch (error) {
    response.status(500).json({ message: "Something went wrong. Please try again" });
  }
}

async function findUserWithCode(email, code) {
  const user = await User.findOne({ email: String(email || "").trim().toLowerCase() });
  if (!user) {
    return null;
  }
  const codeOk = await checkUserCode(user, code);
  return codeOk ? user : null;
}

async function checkResetCode(request, response) {
  try {
    const user = await findUserWithCode(request.body.email, request.body.code);
    if (!user) {
      return response.status(400).json({ message: "That code is wrong or has run out" });
    }
    response.json({ message: "Code confirmed" });
  } catch (error) {
    response.status(500).json({ message: "Something went wrong. Please try again" });
  }
}

async function resetPassword(request, response) {
  try {
    const { email, code, password } = request.body;
    const user = await findUserWithCode(email, code);
    if (!user) {
      return response.status(400).json({ message: "That code is wrong or has run out" });
    }
    if (!goodPassword(password)) {
      return response.status(400).json({ message: "Use at least 8 characters, with a number or a symbol" });
    }
    user.password = await bcrypt.hash(password, 10);
    clearUserCode(user);
    await user.save();
    response.json({ message: "Your password is changed. You can log in now" });
  } catch (error) {
    response.status(500).json({ message: "Something went wrong. Please try again" });
  }
}

module.exports = { forgotPassword, checkResetCode, resetPassword };
