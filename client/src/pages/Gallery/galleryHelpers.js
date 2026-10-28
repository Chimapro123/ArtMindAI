import { getPaintings, getSaved } from "../../services/api";

export const rooms = ["Abstract", "Landscape", "Flower", "Nature", "Figurative", "Religious"];

export const sortChoices = [
  { value: "most-viewed", text: "Most viewed" },
  { value: "most-saved", text: "Most saved" },
  { value: "newest", text: "Newest first" },
  { value: "oldest", text: "Oldest first" },
  { value: "title", text: "Title" }
];

export const pigments = [
  { name: "Ultramarine", hex: "#2b4a9c" },
  { name: "Lead white", hex: "#e8e2d4" },
  { name: "Yellow ochre", hex: "#c8962f" },
  { name: "Vermilion", hex: "#c23b2b" },
  { name: "Viridian", hex: "#2f6a4f" },
  { name: "Ivory black", hex: "#1f1d1b" }
];

export const filterKeys = ["room", "style", "medium", "surface", "colour", "fromYear", "toYear", "hideSeen", "curated", "sort"];

export function readFilters(searchParams) {
  const filters = {};
  filterKeys.forEach((key) => {
    const value = searchParams.get(key);
    if (value) {
      filters[key] = value;
    }
  });
  return filters;
}

function uniqueValues(items, key) {
  const values = [];
  items.forEach((item) => {
    if (item[key] && !values.includes(item[key])) {
      values.push(item[key]);
    }
  });
  return values;
}

function stylesByAge(items) {
  const firstYear = {};
  items.forEach((item) => {
    if (!firstYear[item.style] || item.yearValue < firstYear[item.style]) {
      firstYear[item.style] = item.yearValue;
    }
  });
  return uniqueValues(items, "style").sort((first, second) => firstYear[first] - firstYear[second]);
}

export async function loadFilterOptions() {
  let items = [];
  let page = 1;
  let pages = 1;
  while (page <= pages) {
    const data = await getPaintings({ limit: 60, page });
    items = [...items, ...data.items];
    pages = data.pages;
    page += 1;
  }
  const years = items.map((item) => item.yearValue).filter(Boolean);
  return {
    count: items.length,
    styles: stylesByAge(items),
    mediums: uniqueValues(items, "medium").sort(),
    surfaces: uniqueValues(items, "surface").sort(),
    minYear: Math.floor(Math.min(...years) / 10) * 10,
    maxYear: Math.ceil(Math.max(...years) / 10) * 10
  };
}

export async function loadSavedSlugs() {
  const data = await getSaved({ limit: 60 });
  return data.items.map((item) => item.slug);
}

export function wallWidth(painting) {
  const pixels = Math.round((painting.widthCm || 100) * 1.3);
  return Math.min(380, Math.max(150, pixels)) + "px";
}
