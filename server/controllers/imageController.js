const jwt = require("jsonwebtoken");
const Image = require("../models/Image");

function isOwner(request, image) {
  try {
    const payload = jwt.verify(request.cookies.token || "", process.env.JWT_SECRET);
    return String(payload.id) === String(image.owner);
  } catch (error) {
    return false;
  }
}

async function getImage(request, response) {
  try {
    const id = request.params.id;
    if (!/^[a-f0-9]{24}$/.test(id)) {
      return response.status(404).json({ message: "We could not find that image" });
    }
    const image = await Image.findById(id);
    if (!image || (image.owner && !isOwner(request, image))) {
      return response.status(404).json({ message: "We could not find that image" });
    }
    response.set("Content-Type", image.contentType);
    response.set("Cache-Control", (image.owner ? "private" : "public") + ", max-age=31536000, immutable");
    response.send(image.data);
  } catch (error) {
    response.status(500).json({ message: "The image could not be loaded" });
  }
}

module.exports = { getImage };
