const jwt = require("jsonwebtoken");
const User = require("../models/User");

async function findUser(request, response, next) {
  request.user = null;
  try {
    const token = request.cookies.token;
    if (token) {
      const payload = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(payload.id);
      if (user && user.isVerified) {
        request.user = user;
      }
    }
  } catch (error) {
    request.user = null;
  }
  next();
}

module.exports = findUser;
