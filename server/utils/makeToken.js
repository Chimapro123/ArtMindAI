const jwt = require("jsonwebtoken");

const sevenDays = 7 * 24 * 60 * 60 * 1000;

function cookieOptions() {
  return {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: sevenDays
  };
}

function setLoginCookie(response, user) {
  const token = jwt.sign({ id: String(user._id) }, process.env.JWT_SECRET, { expiresIn: "7d" });
  response.cookie("token", token, cookieOptions());
}

function clearLoginCookie(response) {
  const options = cookieOptions();
  delete options.maxAge;
  response.clearCookie("token", options);
}

module.exports = { setLoginCookie, clearLoginCookie };
