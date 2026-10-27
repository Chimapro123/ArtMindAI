const { shapePainting } = require("./shapePainting");

function paintingOf(item) {
  return item.painting && item.painting.slug ? item.painting : null;
}

function shapeCollection(collection, withPaintings) {
  const items = (collection.items || []).filter(paintingOf);
  const lead = collection.leadPainting && collection.leadPainting.slug ? collection.leadPainting : null;
  const first = lead || (items.length ? items[0].painting : null);
  const shaped = {
    slug: collection.slug,
    title: collection.title,
    description: collection.line || "",
    type: collection.type,
    owner: collection.user ? String(collection.user._id || collection.user) : null,
    cover: first ? first.thumb : "",
    leadPainting: shapePainting(first),
    paintingCount: items.length,
    minutes: Math.max(1, items.length * 2),
    createdAt: collection.createdAt
  };
  if (withPaintings) {
    shaped.paintings = items.map((item) => ({
      painting: shapePainting(item.painting),
      note: item.note || "",
      x: item.x === undefined ? null : item.x,
      y: item.y === undefined ? null : item.y
    }));
  }
  return shaped;
}

module.exports = { shapeCollection };
