const pigments = [
  { name: "Lead white", hex: "#e8e2d4", title: "Pale and soft" },
  { name: "Ivory black", hex: "#1f1d1b", title: "After dark" },
  { name: "Ultramarine", hex: "#2b4a9c", title: "Your blue hour" },
  { name: "Prussian blue", hex: "#1f3350", title: "Deep water" },
  { name: "Cerulean", hex: "#5a90c4", title: "Open skies" },
  { name: "Yellow ochre", hex: "#c8962f", title: "Golden light" },
  { name: "Naples yellow", hex: "#e4cf7c", title: "Warm sunshine" },
  { name: "Vermilion", hex: "#c23b2b", title: "Seeing red" },
  { name: "Rose madder", hex: "#b86a86", title: "A little blush" },
  { name: "Viridian", hex: "#2f6a4f", title: "Green and growing" },
  { name: "Sap green", hex: "#728c3c", title: "Fresh leaves" },
  { name: "Terre verte", hex: "#73806a", title: "Soft moss" },
  { name: "Burnt umber", hex: "#4f3522", title: "Old wood" },
  { name: "Raw sienna", hex: "#a8733a", title: "Warm earth" },
  { name: "Venetian red", hex: "#8a3a2c", title: "Brick and rust" },
  { name: "Slate grey", hex: "#6c6a68", title: "Quiet grey" },
  { name: "Payne's grey", hex: "#49505c", title: "Storm light" },
  { name: "Bone", hex: "#c9bfae", title: "Warm stone" }
];

const homePigments = ["Ultramarine", "Lead white", "Yellow ochre", "Vermilion", "Viridian", "Ivory black"];

function findPigment(name) {
  return pigments.find((pigment) => pigment.name.toLowerCase() === String(name || "").toLowerCase()) || null;
}

module.exports = { pigments, homePigments, findPigment };
