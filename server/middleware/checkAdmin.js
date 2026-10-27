function checkAdmin(request, response, next) {
  if (!request.user || request.user.role !== "admin") {
    return response.status(403).json({ message: "Only an admin can do that" });
  }
  next();
}

module.exports = checkAdmin;
