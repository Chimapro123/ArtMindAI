const { words } = require("./readSentence");
const { skipWords } = require("./wordLists");

function stem(word) {
  return word.endsWith("s") && word.length > 3 ? word.slice(0, -1) : word;
}

function findMatches(question, paintings, firstSlug) {
  const asked = words(question).filter((word) => word.length > 2 && !skipWords.includes(word)).map(stem);
  const scored = paintings
    .map((painting) => {
      const title = words(painting.title).map(stem);
      const artist = words(painting.artist).map(stem);
      const tags = (painting.tags || []).flatMap((tag) => words(tag)).map(stem);
      const extra = [painting.room, painting.style].flatMap((text) => words(text)).map(stem);
      let score = 0;
      asked.forEach((word) => {
        if (title.includes(word)) {
          score += 3;
        }
        if (artist.includes(word)) {
          score += 2;
        }
        if (tags.includes(word)) {
          score += 1;
        }
        if (extra.includes(word)) {
          score += 1;
        }
      });
      if (firstSlug && painting.slug === firstSlug) {
        score += 10;
      }
      return { painting, score };
    })
    .filter((item) => item.score > 0)
    .sort((first, second) => second.score - first.score || second.painting.views - first.painting.views);
  return scored.slice(0, 5).map((item) => item.painting);
}

function factsFor(painting) {
  const size = painting.widthCm && painting.heightCm ? painting.widthCm + " by " + painting.heightCm + " cm" : "size unknown";
  const story = painting.story ? " Story: " + painting.story.slice(0, 500) : "";
  return (
    "slug: " + painting.slug + ". " + painting.title + " by " + painting.artist + ", " + painting.year + ". " +
    painting.room + " room, " + painting.style + ", " + painting.medium + " on " + painting.surface + ", " + size + ", " +
    "hangs in " + painting.whereItHangs + ". Tags: " + (painting.tags || []).join(", ") + "." + story
  );
}

function fallbackAnswer(question, matches) {
  if (!matches.length) {
    return "I'm not sure about that one. I only know the paintings in this gallery, so try asking about one of them, or about a room, a colour or a mood.";
  }
  const painting = matches[0];
  const firstSentence = painting.story ? painting.story.split(/(?<=[.!?])\s/)[0] : "";
  const base = painting.title + " was painted by " + painting.artist + " in " + painting.year + ". It is " + painting.medium.toLowerCase() + " on " + painting.surface.toLowerCase() + " and hangs in our " + painting.room + " room.";
  return firstSentence ? base + " " + firstSentence : base;
}

function makeTitle(question) {
  const clean = String(question).trim().replace(/[?.!]+$/, "");
  const short = clean.split(/\s+/).slice(0, 6).join(" ");
  const title = short.length > 40 ? short.slice(0, 40).trim() : short;
  return title ? title.charAt(0).toUpperCase() + title.slice(1) : "New conversation";
}

function tidyAnswer(text) {
  const noDashes = String(text).replace(/[—–]/g, ",");
  return noDashes.replace(/\s+,/g, ",").replace(/,(?=\S)/g, ", ").replace(/\s+/g, " ").trim();
}

module.exports = { findMatches, factsFor, fallbackAnswer, makeTitle, tidyAnswer };
