function loadImage(file) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const image = new Image();
    image.onload = () => {
      URL.revokeObjectURL(url);
      resolve(image);
    };
    image.onerror = () => reject(new Error("That photo could not be read."));
    image.src = url;
  });
}

function canvasToFile(canvas, name) {
  return new Promise((resolve) => {
    canvas.toBlob((blob) => resolve(new File([blob], name, { type: "image/jpeg" })), "image/jpeg", 0.92);
  });
}

export async function rotatePhoto(file) {
  const image = await loadImage(file);
  const canvas = document.createElement("canvas");
  canvas.width = image.height;
  canvas.height = image.width;
  const context = canvas.getContext("2d");
  context.translate(canvas.width / 2, canvas.height / 2);
  context.rotate(Math.PI / 2);
  context.drawImage(image, -image.width / 2, -image.height / 2);
  return canvasToFile(canvas, "rotated.jpg");
}

export async function cropPhoto(file, box) {
  const image = await loadImage(file);
  const left = Math.round((box.left / 100) * image.width);
  const top = Math.round((box.top / 100) * image.height);
  const width = Math.max(1, Math.round((box.width / 100) * image.width));
  const height = Math.max(1, Math.round((box.height / 100) * image.height));
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  canvas.getContext("2d").drawImage(image, left, top, width, height, 0, 0, width, height);
  return canvasToFile(canvas, "cropped.jpg");
}

export function friendlyTime(dateText) {
  const then = new Date(dateText);
  const days = Math.floor((Date.now() - then.getTime()) / (1000 * 60 * 60 * 24));
  if (days <= 0) {
    return "today";
  }
  if (days === 1) {
    return "yesterday";
  }
  if (days < 7) {
    return days + " days ago";
  }
  if (days < 14) {
    return "last week";
  }
  if (days < 30) {
    return Math.floor(days / 7) + " weeks ago";
  }
  if (days < 60) {
    return "last month";
  }
  return Math.floor(days / 30) + " months ago";
}

export function sureWords(confidence) {
  if (confidence >= 70) {
    return "Fairly sure";
  }
  if (confidence >= 50) {
    return "Not very sure";
  }
  return "Just a guess";
}
