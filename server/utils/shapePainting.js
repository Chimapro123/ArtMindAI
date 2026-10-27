function shapePainting(painting) {
  if (!painting) {
    return null;
  }
  const plain = typeof painting.toObject === "function" ? painting.toObject() : { ...painting };
  delete plain._id;
  delete plain.__v;
  return plain;
}

function shapeArtist(artist, paintingCount) {
  if (!artist) {
    return null;
  }
  const plain = typeof artist.toObject === "function" ? artist.toObject() : { ...artist };
  return {
    slug: plain.slug,
    name: plain.name,
    born: plain.born,
    died: plain.died,
    nationality: plain.nationality,
    era: plain.era,
    letter: plain.letter,
    portrait: plain.portrait,
    portraitLicence: plain.portraitLicence || null,
    portraitSourceUrl: plain.portraitSourceUrl || null,
    about: plain.bio || "",
    quote: plain.quote ? { text: plain.quote, source: plain.quoteSource || "" } : null,
    life: plain.lifeStops || [],
    spotlightLine: plain.spotlightLine || "",
    paintingCount: paintingCount || 0
  };
}

function pageList(items, total, page, limit) {
  return {
    items,
    total,
    page,
    pages: Math.max(1, Math.ceil(total / limit))
  };
}

function readPage(query) {
  const page = Math.max(1, parseInt(query.page, 10) || 1);
  const limit = Math.min(60, Math.max(1, parseInt(query.limit, 10) || 12));
  return { page, limit, skip: (page - 1) * limit };
}

module.exports = { shapePainting, shapeArtist, pageList, readPage };
