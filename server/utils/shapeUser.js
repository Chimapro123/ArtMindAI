function shapeUser(user) {
  return {
    id: String(user._id),
    name: user.name,
    email: user.email,
    role: user.role,
    photo: user.photo || null,
    about: user.bio || "",
    rooms: user.rooms || [],
    emails: {
      newsletter: Boolean(user.emailLetters),
      newCollections: Boolean(user.emailNewCollections)
    },
    emailConfirmed: Boolean(user.isVerified),
    memberSince: user.createdAt
  };
}

function goodPassword(password) {
  const text = String(password || "");
  if (text.length < 8) {
    return false;
  }
  return /[0-9]/.test(text) || /[^A-Za-z0-9]/.test(text);
}

function goodEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email || "").trim());
}

const roomNames = ["Abstract", "Landscape", "Flower", "Nature", "Figurative", "Religious"];

function cleanRooms(rooms) {
  if (!Array.isArray(rooms)) {
    return [];
  }
  return rooms.filter((room) => roomNames.includes(room));
}

module.exports = { shapeUser, goodPassword, goodEmail, cleanRooms, roomNames };
