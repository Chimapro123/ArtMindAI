const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const uploadsFolder = path.join(__dirname, "..", "uploads");

function makeFolder(name) {
  const folder = path.join(uploadsFolder, name);
  fs.mkdirSync(folder, { recursive: true });
  return folder;
}

async function saveResized(buffer, folderName, fileName, size, fit) {
  const folder = makeFolder(folderName);
  const fullPath = path.join(folder, fileName);
  await sharp(buffer)
    .rotate()
    .resize(size, size, { fit: fit || "inside", withoutEnlargement: true })
    .jpeg({ quality: 86 })
    .toFile(fullPath);
  return "/uploads/" + folderName + "/" + fileName;
}

async function savePaintingImages(buffer, slug) {
  const image = await saveResized(buffer, "paintings", slug + ".jpg", 1600);
  const thumb = await saveResized(buffer, "paintings/thumbs", slug + ".jpg", 600);
  return { image, thumb };
}

async function saveProfilePhoto(buffer, userId) {
  const fileName = userId + "-" + Date.now() + ".jpg";
  return saveResized(buffer, "photos", fileName, 400, "cover");
}

async function saveLabPhoto(buffer, userId) {
  const fileName = userId + "-" + Date.now() + ".jpg";
  return saveResized(buffer, "lab", fileName, 1200);
}

function removeUpload(urlPath) {
  if (!urlPath || !urlPath.startsWith("/uploads/")) {
    return;
  }
  const clean = urlPath.split("?")[0].replace("/uploads/", "");
  const fullPath = path.join(uploadsFolder, clean);
  try {
    if (fs.existsSync(fullPath)) {
      fs.unlinkSync(fullPath);
    }
  } catch (error) {
    console.log("Could not remove " + clean);
  }
}

module.exports = { savePaintingImages, saveProfilePhoto, saveLabPhoto, removeUpload };
