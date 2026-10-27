function makeSlug(text) {
  return String(text || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

async function uniqueSlug(Model, text) {
  const base = makeSlug(text) || "item";
  let slug = base;
  let number = 2;
  while (await Model.exists({ slug })) {
    slug = base + "-" + number;
    number += 1;
  }
  return slug;
}

module.exports = { makeSlug, uniqueSlug };
