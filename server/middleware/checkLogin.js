const jwt = require("jsonwebtoken");
const User = require("../models/User");

async function checkLogin(request, response, next) {
  try {
    const token = request.cookies.token;
    if (!token) {
      return response.status(401).json({ message: "Please log in first" });
    }
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(payload.id);
    if (!user || !user.isVerified) {
      return response.status(401).json({ message: "Please log in first" });
    }
    request.user = user;
    next();
  } catch (error) {
    response.status(401).json({ message: "Please log in first" });
  }
}

module.exports = checkLogin;
