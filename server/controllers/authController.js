const bcrypt = require("bcryptjs");
const User = require("../models/User");
const { setLoginCookie, clearLoginCookie } = require("../utils/makeToken");
const { giveUserCode, checkUserCode, clearUserCode, canSendAgain } = require("../utils/makeCode");
const { shapeUser, goodPassword, goodEmail, cleanRooms } = require("../utils/shapeUser");

async function register(request, response) {
  try {
    const { name, email, password, rooms } = request.body;
    const cleanName = String(name || "").trim();
    const cleanEmail = String(email || "").trim().toLowerCase();
    if (!cleanName || !cleanEmail || !password) {
      return response.status(400).json({ message: "Please fill in your name, email and password" });
    }
    if (!goodEmail(cleanEmail)) {
      return response.status(400).json({ message: "That email does not look right" });
    }
    if (!goodPassword(password)) {
      return response.status(400).json({ message: "Use at least 8 characters, with a number or a symbol" });
    }
    let user = await User.findOne({ email: cleanEmail });
    if (user && user.isVerified) {
      return response.status(409).json({ message: "That email already has a pass. Try logging in" });
    }
    const hash = await bcrypt.hash(password, 10);
    if (!user) {
      user = new User({ name: cleanName, email: cleanEmail, password: hash, rooms: cleanRooms(rooms) });
    } else {
      user.name = cleanName;
      user.password = hash;
      user.rooms = cleanRooms(rooms);
    }
    await giveUserCode(user, "verify");
    response.status(201).json({ message: "We have sent a six digit code to your email", email: user.email });
  } catch (error) {
    response.status(500).json({ message: "Something went wrong. Please try again" });
  }
}

async function verifyEmail(request, response) {
  try {
    const { email, code } = request.body;
    const user = await User.findOne({ email: String(email || "").trim().toLowerCase() });
    if (!user) {
      return response.status(400).json({ message: "That code is wrong or has run out" });
    }
    const codeOk = await checkUserCode(user, code);
    if (!codeOk) {
      return response.status(400).json({ message: "That code is wrong or has run out" });
    }
    user.isVerified = true;
    clearUserCode(user);
    await user.save();
    setLoginCookie(response, user);
    response.json({ user: shapeUser(user) });
  } catch (error) {
    response.status(500).json({ message: "Something went wrong. Please try again" });
  }
}

async function resendCode(request, response) {
  try {
    const user = await User.findOne({ email: String(request.body.email || "").trim().toLowerCase() });
    if (!user) {
      return response.status(400).json({ message: "We could not find that email" });
    }
    if (user.isVerified) {
      return response.status(400).json({ message: "That email is already confirmed. Try logging in" });
    }
    if (!canSendAgain(user)) {
      return response.status(429).json({ message: "Please wait a minute before asking for another code" });
    }
    await giveUserCode(user, "verify");
    response.json({ message: "A new code is on its way" });
  } catch (error) {
    response.status(500).json({ message: "Something went wrong. Please try again" });
  }
}

async function login(request, response) {
  try {
    const { email, password } = request.body;
    const user = await User.findOne({ email: String(email || "").trim().toLowerCase() });
    if (!user) {
      return response.status(401).json({ message: "Email or password is wrong" });
    }
    const passwordOk = await bcrypt.compare(String(password || ""), user.password);
    if (!passwordOk) {
      return response.status(401).json({ message: "Email or password is wrong" });
    }
    if (!user.isVerified) {
      if (canSendAgain(user)) {
        await giveUserCode(user, "verify");
      }
      return response.status(403).json({ message: "Please confirm your email first", needsVerification: true });
    }
    setLoginCookie(response, user);
    response.json({ user: shapeUser(user) });
  } catch (error) {
    response.status(500).json({ message: "Something went wrong. Please try again" });
  }
}

async function logout(request, response) {
  try {
    clearLoginCookie(response);
    response.json({ message: "You are logged out" });
  } catch (error) {
    response.status(500).json({ message: "Something went wrong. Please try again" });
  }
}

async function me(request, response) {
  try {
    response.json({ user: shapeUser(request.user) });
  } catch (error) {
    response.status(500).json({ message: "Something went wrong. Please try again" });
  }
}

module.exports = { register, verifyEmail, resendCode, login, logout, me };
