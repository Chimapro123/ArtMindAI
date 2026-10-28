const bcrypt = require("bcryptjs");
const User = require("../models/User");
const View = require("../models/View");
const Search = require("../models/Search");
const Conversation = require("../models/Conversation");
const Upload = require("../models/Upload");
const Collection = require("../models/Collection");
const { clearLoginCookie } = require("../utils/makeToken");
const { shapeUser, goodPassword, cleanRooms } = require("../utils/shapeUser");
const { saveProfilePhoto, removeImages, removeOwnedImages } = require("../utils/saveImage");

async function getProfile(request, response) {
  try {
    response.json({ user: shapeUser(request.user) });
  } catch (error) {
    response.status(500).json({ message: "Something went wrong. Please try again" });
  }
}

async function updateProfile(request, response) {
  try {
    const user = request.user;
    const { name, about, rooms } = request.body;
    if (name !== undefined) {
      const cleanName = String(name).trim();
      if (!cleanName) {
        return response.status(400).json({ message: "Your name cannot be empty" });
      }
      user.name = cleanName;
    }
    if (about !== undefined) {
      user.bio = String(about).trim().slice(0, 500);
    }
    if (rooms !== undefined) {
      user.rooms = cleanRooms(rooms);
    }
    await user.save();
    response.json({ user: shapeUser(user) });
  } catch (error) {
    response.status(500).json({ message: "Something went wrong. Please try again" });
  }
}

async function uploadPhoto(request, response) {
  try {
    if (!request.file) {
      return response.status(400).json({ message: "Please choose a JPG or PNG photo" });
    }
    const user = request.user;
    const oldPhoto = user.photo;
    user.photo = await saveProfilePhoto(request.file.buffer, user._id);
    await user.save();
    await removeImages([oldPhoto]);
    response.json({ user: shapeUser(user) });
  } catch (error) {
    response.status(500).json({ message: "That photo could not be saved. Please try another one" });
  }
}

async function changePassword(request, response) {
  try {
    const { currentPassword, newPassword } = request.body;
    const user = request.user;
    const currentOk = await bcrypt.compare(String(currentPassword || ""), user.password);
    if (!currentOk) {
      return response.status(400).json({ message: "Your current password is wrong" });
    }
    if (!goodPassword(newPassword)) {
      return response.status(400).json({ message: "Use at least 8 characters, with a number or a symbol" });
    }
    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();
    response.json({ message: "Your password is changed" });
  } catch (error) {
    response.status(500).json({ message: "Something went wrong. Please try again" });
  }
}

async function updateEmails(request, response) {
  try {
    const { newsletter, newCollections } = request.body;
    const user = request.user;
    if (newsletter !== undefined) {
      user.emailLetters = Boolean(newsletter);
    }
    if (newCollections !== undefined) {
      user.emailNewCollections = Boolean(newCollections);
    }
    await user.save();
    response.json({ user: shapeUser(user) });
  } catch (error) {
    response.status(500).json({ message: "Something went wrong. Please try again" });
  }
}

async function closePass(request, response) {
  try {
    const user = request.user;
    await removeOwnedImages(user._id);
    await Upload.deleteMany({ user: user._id });
    await View.deleteMany({ user: user._id });
    await Search.deleteMany({ user: user._id });
    await Conversation.deleteMany({ user: user._id });
    await Collection.deleteMany({ user: user._id, type: "mine" });
    await User.deleteOne({ _id: user._id });
    clearLoginCookie(response);
    response.json({ message: "Your pass is closed. Thank you for visiting" });
  } catch (error) {
    response.status(500).json({ message: "Something went wrong. Please try again" });
  }
}

module.exports = { getProfile, updateProfile, uploadPhoto, changePassword, updateEmails, closePass };
