export const sortChoices = [
  { value: "oldest", text: "Oldest first" },
  { value: "newest", text: "Newest first" },
  { value: "most-viewed", text: "Most looked at" },
  { value: "title", text: "Title" }
];

export function sortPaintings(paintings, sort) {
  const list = [...paintings];
  if (sort === "newest") {
    return list.sort((first, second) => second.yearValue - first.yearValue);
  }
  if (sort === "most-viewed") {
    return list.sort((first, second) => second.views - first.views);
  }
  if (sort === "title") {
    return list.sort((first, second) => first.title.localeCompare(second.title));
  }
  return list.sort((first, second) => first.yearValue - second.yearValue);
}

export function wallWidth(painting) {
  const pixels = Math.round((painting.widthCm || 100) * 1.2);
  return Math.min(320, Math.max(140, pixels)) + "px";
}

export function possessive(name) {
  return name.endsWith("s") ? name + "'" : name + "'s";
}
