const sharp = require("sharp");
const Image = require("../models/Image");

const imagesPath = "/api/images/";

async function storeImage(buffer, size, fit, owner) {
  const data = await sharp(buffer)
    .rotate()
    .resize(size, size, { fit: fit || "inside", withoutEnlargement: true })
    .jpeg({ quality: 86 })
    .toBuffer();
  const image = await Image.create({ data, contentType: "image/jpeg", owner: owner || null });
  return imagesPath + image._id;
}

async function savePaintingImages(buffer) {
  const image = await storeImage(buffer, 1600);
  const thumb = await storeImage(buffer, 600);
  return { image, thumb };
}

async function saveProfilePhoto(buffer, userId) {
  return storeImage(buffer, 400, "cover", userId);
}

async function saveLabPhoto(buffer, userId) {
  return storeImage(buffer, 1200, "inside", userId);
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

async function removeImages(urlPaths) {
  const ids = urlPaths.map(storedImageId).filter(Boolean);
  if (ids.length) {
    await Image.deleteMany({ _id: { $in: ids } });
  }
}

async function removeOwnedImages(userId) {
  await Image.deleteMany({ owner: userId });
}

module.exports = { savePaintingImages, saveProfilePhoto, saveLabPhoto, readStoredImage, removeImages, removeOwnedImages };
