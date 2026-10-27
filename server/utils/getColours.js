const sharp = require("sharp");
const { pigments } = require("./pigments");

function hexToRgb(hex) {
  const clean = hex.replace("#", "");
  return [parseInt(clean.slice(0, 2), 16), parseInt(clean.slice(2, 4), 16), parseInt(clean.slice(4, 6), 16)];
}

function rgbToHex(red, green, blue) {
  const parts = [red, green, blue].map((value) => Math.round(value).toString(16).padStart(2, "0"));
  return "#" + parts.join("");
}

function channelToLinear(value) {
  const part = value / 255;
  return part <= 0.04045 ? part / 12.92 : Math.pow((part + 0.055) / 1.055, 2.4);
}

function rgbToLab(red, green, blue) {
  const r = channelToLinear(red);
  const g = channelToLinear(green);
  const b = channelToLinear(blue);
  const x = (r * 0.4124 + g * 0.3576 + b * 0.1805) / 0.95047;
  const y = r * 0.2126 + g * 0.7152 + b * 0.0722;
  const z = (r * 0.0193 + g * 0.1192 + b * 0.9505) / 1.08883;
  const fix = (value) => (value > 0.008856 ? Math.cbrt(value) : 7.787 * value + 16 / 116);
  const fx = fix(x);
  const fy = fix(y);
  const fz = fix(z);
  return [116 * fy - 16, 500 * (fx - fy), 200 * (fy - fz)];
}

const pigmentLabs = pigments.map((pigment) => {
  const [red, green, blue] = hexToRgb(pigment.hex);
  return { name: pigment.name, lab: rgbToLab(red, green, blue) };
});

function nearestPigment(red, green, blue) {
  const lab = rgbToLab(red, green, blue);
  let best = pigmentLabs[0];
  let bestDistance = Infinity;
  pigmentLabs.forEach((pigment) => {
    const dl = lab[0] - pigment.lab[0];
    const da = lab[1] - pigment.lab[1];
    const db = lab[2] - pigment.lab[2];
    const distance = dl * dl + da * da + db * db;
    if (distance < bestDistance) {
      bestDistance = distance;
      best = pigment;
    }
  });
  return best.name;
}

async function getColours(source, howMany) {
  const wanted = howMany || 5;
  const { data, info } = await sharp(source)
    .rotate()
    .resize(64, 64, { fit: "inside" })
    .removeAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const buckets = {};
  const total = info.width * info.height;
  for (let index = 0; index < data.length; index += 3) {
    const red = data[index];
    const green = data[index + 1];
    const blue = data[index + 2];
    const name = nearestPigment(red, green, blue);
    if (!buckets[name]) {
      buckets[name] = { name, count: 0, red: 0, green: 0, blue: 0 };
    }
    buckets[name].count += 1;
    buckets[name].red += red;
    buckets[name].green += green;
    buckets[name].blue += blue;
  }
  const sorted = Object.values(buckets).sort((first, second) => second.count - first.count).slice(0, wanted);
  return sorted.map((bucket) => ({
    name: bucket.name,
    hex: rgbToHex(bucket.red / bucket.count, bucket.green / bucket.count, bucket.blue / bucket.count),
    percent: Math.max(1, Math.round((bucket.count / total) * 100))
  }));
}

module.exports = getColours;
