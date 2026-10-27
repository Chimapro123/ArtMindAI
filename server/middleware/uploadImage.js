const multer = require("multer");

const fiveMb = 5 * 1024 * 1024;

function fileFilter(request, file, callback) {
  const okTypes = ["image/jpeg", "image/png"];
  if (!okTypes.includes(file.mimetype)) {
    return callback(new Error("Please choose a JPG or PNG image"));
  }
  callback(null, true);
}

const uploadImage = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: fiveMb },
  fileFilter
});

module.exports = uploadImage;
