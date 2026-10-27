const { colourWords } = require("./wordLists");

const moodTags = {
  calm: ["calm", "quiet", "gentle", "soft", "still"],
  stormy: ["stormy", "storm", "wild"],
  dramatic: ["dramatic", "bold", "energy"],
  joyful: ["joyful", "summer", "light"],
  dark: ["dark", "gloomy", "sad", "cold", "night"],
  dreamy: ["dreamy", "mysterious", "fog", "mist"]
};

function stem(word) {
  const lower = String(word).toLowerCase();
  return lower.endsWith("s") && lower.length > 3 ? lower.slice(0, -1) : lower;
}

function subjectHits(painting, subject) {
  const wanted = stem(subject);
  const tags = (painting.tags || []).map(stem);
  const titleWords = String(painting.title).toLowerCase().split(/[^a-z]+/).map(stem);
  const artistWords = String(painting.artist).toLowerCase().split(/[^a-z]+/).map(stem);
  return tags.includes(wanted) || tags.some((tag) => tag.includes(wanted) && wanted.length > 3) || titleWords.includes(wanted) || artistWords.includes(wanted);
}

function capitalise(text) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

function scorePainting(painting, wants) {
  let score = 0;
  const whys = [];
  if (wants.room && painting.room === wants.room) {
    score += 3;
    whys.push("hangs in the " + wants.room + " room");
  }
  (wants.colours || []).forEach((name) => {
    const found = (painting.colours || []).slice(0, 4).find((colour) => colour.name === name);
    const tagHit = (colourWords[name] || []).find((word) => (painting.tags || []).includes(word));
    if (found) {
      score += 2;
      whys.push("full of " + name.toLowerCase());
    }
    if (tagHit) {
      score += 2;
      whys.push("has " + tagHit + " in it");
    }
  });
  (wants.moods || []).forEach((mood) => {
    const tags = painting.tags || [];
    if ((moodTags[mood] || [mood]).some((tag) => tags.includes(tag))) {
      score += 2;
      whys.push("feels " + mood);
    }
  });
  (wants.subjects || []).forEach((subject) => {
    if (subjectHits(painting, subject)) {
      score += 3;
      whys.push("has " + String(subject).toLowerCase() + " in it");
    }
  });
  if (wants.style && painting.style === wants.style) {
    score += 2;
    whys.push("painted in the " + wants.style + " style");
  }
  if (wants.medium && painting.medium === wants.medium) {
    score += 1;
    whys.push("made with " + wants.medium.toLowerCase());
  }
  if (wants.fromYear && painting.yearValue >= wants.fromYear && painting.yearValue <= (wants.toYear || 2100)) {
    score += 2;
    whys.push("painted in " + painting.year);
  }
  const why = whys.length ? capitalise(whys.slice(0, 2).join(" and ")) + "." : "";
  return { score, why };
}

function rankPaintings(paintings, wants) {
  return paintings
    .map((painting) => ({ painting, ...scorePainting(painting, wants) }))
    .filter((item) => item.score > 0)
    .sort((first, second) => second.score - first.score || second.painting.views - first.painting.views);
}

module.exports = { rankPaintings, scorePainting };
