export const rooms = ["Abstract", "Landscape", "Flower", "Nature", "Figurative", "Religious"];

export const styles = ["Gothic", "Renaissance", "Northern Renaissance", "Baroque", "Romanticism", "Realism", "Impressionism", "Post Impressionism", "Ukiyo-e", "Modern"];

export const mediums = ["Oil", "Tempera", "Fresco", "Watercolour", "Pastel", "Woodblock print"];

export const surfaces = ["Canvas", "Panel", "Paper", "Wall"];

export const licences = ["Public domain", "CC0"];

export const emptyForm = {
  title: "",
  artistSlug: "",
  artist: "",
  year: "",
  room: "",
  style: "",
  medium: "",
  surface: "",
  widthCm: "",
  heightCm: "",
  whereItHangs: "",
  story: "",
  licence: "Public domain",
  sourceUrl: "",
  tags: []
};

export function formFromPainting(painting) {
  return {
    title: painting.title || "",
    artistSlug: painting.artistSlug || "",
    artist: painting.artist || "",
    year: painting.year || "",
    room: painting.room || "",
    style: painting.style || "",
    medium: painting.medium || "",
    surface: painting.surface || "",
    widthCm: painting.widthCm || "",
    heightCm: painting.heightCm || "",
    whereItHangs: painting.whereItHangs || "",
    story: painting.story || "",
    licence: painting.licence || "Public domain",
    sourceUrl: painting.sourceUrl || "",
    tags: painting.tags || []
  };
}

export function formToData(form, extra) {
  const data = new FormData();
  Object.keys(form).forEach((key) => {
    if (key === "tags") {
      data.append("tags", JSON.stringify(form.tags));
    } else {
      data.append(key, form[key]);
    }
  });
  Object.keys(extra || {}).forEach((key) => {
    data.append(key, extra[key]);
  });
  return data;
}
