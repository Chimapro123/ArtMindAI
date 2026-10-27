const bcrypt = require("bcryptjs");
const { sendCode } = require("./sendEmail");

const tenMinutes = 10 * 60 * 1000;
const oneMinute = 60 * 1000;

function randomCode() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

function canSendAgain(user) {
  if (!user.codeSentAt) {
    return true;
  }
  return Date.now() - user.codeSentAt.getTime() >= oneMinute;
}

async function giveUserCode(user, reason) {
  const code = randomCode();
  user.code = await bcrypt.hash(code, 8);
  user.codeExpires = new Date(Date.now() + tenMinutes);
  user.codeSentAt = new Date();
  await user.save();
  await sendCode(user.email, code, reason);
}

async function checkUserCode(user, code) {
  if (!user.code || !user.codeExpires) {
    return false;
  }
  if (user.codeExpires.getTime() < Date.now()) {
    return false;
  }
  const clean = String(code || "").trim();
  if (!/^\d{6}$/.test(clean)) {
    return false;
  }
  return bcrypt.compare(clean, user.code);
}

function clearUserCode(user) {
  user.code = null;
  user.codeExpires = null;
}

module.exports = { giveUserCode, checkUserCode, clearUserCode, canSendAgain };
