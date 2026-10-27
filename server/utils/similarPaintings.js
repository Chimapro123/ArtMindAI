function colourNames(painting) {
  return (painting.colours || []).slice(0, 3).map((colour) => colour.name);
}

function compare(painting, other) {
  const reasons = [];
  let score = 0;
  if (other.style && other.style === painting.style) {
    score += 3;
    reasons.push({ weight: 3, text: "Also from the " + painting.style + " years." });
  }
  if (other.room && other.room === painting.room) {
    score += 2;
    reasons.push({ weight: 2, text: "Hangs in the same room." });
  }
  const mine = colourNames(painting);
  const theirs = colourNames(other);
  const shared = mine.filter((name) => theirs.includes(name));
  if (shared.length) {
    score += shared.length;
    reasons.push({ weight: 1.5 + shared.length * 0.1, text: "Shares its " + shared[0].toLowerCase() + "." });
  }
  if (painting.yearValue && other.yearValue && Math.abs(painting.yearValue - other.yearValue) <= 30) {
    score += 1;
    reasons.push({ weight: 1, text: "Painted around the same time." });
  }
  reasons.sort((first, second) => second.weight - first.weight);
  return { score, reason: reasons.length ? reasons[0].text : "" };
}

function findSimilar(painting, others, howMany) {
  return others
    .filter((other) => other.slug !== painting.slug && other.artistSlug !== painting.artistSlug)
    .map((other) => ({ painting: other, ...compare(painting, other) }))
    .filter((item) => item.score > 0)
    .sort((first, second) => second.score - first.score || second.painting.views - first.painting.views)
    .slice(0, howMany || 4);
}

module.exports = { findSimilar, compare };
