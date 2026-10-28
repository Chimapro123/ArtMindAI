const fs = require("fs");
const path = require("path");
const sharp = require("sharp");
const Image = require("../models/Image");

const uploadsFolder = path.join(__dirname, "..", "uploads");
const imagesPath = "/api/images/";

function makeFolder(name) {
  const folder = path.join(uploadsFolder, name);
  fs.mkdirSync(folder, { recursive: true });
  return folder;
}

function shrink(buffer, size, fit) {
  return sharp(buffer)
    .rotate()
    .resize(size, size, { fit: fit || "inside", withoutEnlargement: true })
    .jpeg({ quality: 86 });
}

async function saveResized(buffer, folderName, fileName, size, fit) {
  const folder = makeFolder(folderName);
  await shrink(buffer, size, fit).toFile(path.join(folder, fileName));
  return "/uploads/" + folderName + "/" + fileName;
}

async function storeImage(buffer, size) {
  const data = await shrink(buffer, size).toBuffer();
  const image = await Image.create({ data, contentType: "image/jpeg" });
  return imagesPath + image._id;
}

async function savePaintingImages(buffer) {
  const image = await storeImage(buffer, 1600);
  const thumb = await storeImage(buffer, 600);
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

function storedImageId(urlPath) {
  if (!urlPath || !urlPath.startsWith(imagesPath)) {
    return null;
  }
  const id = urlPath.split("?")[0].replace(imagesPath, "");
  return /^[a-f0-9]{24}$/.test(id) ? id : null;
}

async function readStoredImage(urlPath) {
  const id = storedImageId(urlPath);
  if (!id) {
    return null;
  }
  const image = await Image.findById(id);
  return image ? image.data : null;
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

async function removePaintingImages(urlPaths) {
  for (const urlPath of urlPaths) {
    removeUpload(urlPath);
    const id = storedImageId(urlPath);
    if (id) {
      await Image.deleteOne({ _id: id });
    }
  }
}

module.exports = { savePaintingImages, saveProfilePhoto, saveLabPhoto, readStoredImage, removeUpload, removePaintingImages };
