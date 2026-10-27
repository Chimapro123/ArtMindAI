const { roomWords, colourWords, moodWords, styleNames, mediumNames, eraWords, skipWords } = require("./wordLists");

function words(sentence) {
  return String(sentence || "")
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter(Boolean);
}

function hasPhrase(sentence, phrase) {
  return (" " + sentence + " ").includes(" " + phrase + " ");
}

function readSentence(sentence) {
  const lower = String(sentence || "").toLowerCase().replace(/[^a-z0-9\s]/g, " ").replace(/\s+/g, " ").trim();
  const wants = { room: "", colours: [], moods: [], subjects: [], style: "", medium: "", fromYear: null, toYear: null };
  const parts = [];
  const used = new Set();

  Object.keys(roomWords).forEach((room) => {
    const hit = roomWords[room].find((word) => hasPhrase(lower, word));
    if (hit && !wants.room) {
      wants.room = room;
      parts.push({ text: hit, type: "room" });
      used.add(hit);
    }
  });

  Object.keys(colourWords).forEach((name) => {
    const hit = colourWords[name].find((word) => hasPhrase(lower, word)) || (hasPhrase(lower, name.toLowerCase()) ? name.toLowerCase() : null);
    if (hit) {
      wants.colours.push(name);
      parts.push({ text: hit, type: "colour" });
      used.add(hit);
    }
  });

  Object.keys(moodWords).forEach((mood) => {
    const hit = moodWords[mood].find((word) => hasPhrase(lower, word));
    if (hit) {
      wants.moods.push(mood);
      parts.push({ text: hit, type: "mood" });
      used.add(hit);
    }
  });

  styleNames.forEach((style) => {
    if (hasPhrase(lower, style.toLowerCase()) && !wants.style) {
      wants.style = style;
      parts.push({ text: style.toLowerCase(), type: "style" });
      style.toLowerCase().split(" ").forEach((word) => used.add(word));
    }
  });

  mediumNames.forEach((medium) => {
    if (hasPhrase(lower, medium.toLowerCase()) && !wants.medium) {
      wants.medium = medium;
      parts.push({ text: medium.toLowerCase(), type: "medium" });
      medium.toLowerCase().split(" ").forEach((word) => used.add(word));
    }
  });

  eraWords.forEach((era) => {
    const hit = era.words.find((word) => hasPhrase(lower, word));
    if (hit && !wants.fromYear) {
      wants.fromYear = era.from;
      wants.toYear = era.to;
      parts.push({ text: hit, type: "time" });
      hit.split(" ").forEach((word) => used.add(word));
    }
  });

  words(lower).forEach((word) => {
    if (word.length > 2 && !skipWords.includes(word) && !used.has(word) && !wants.subjects.includes(word)) {
      wants.subjects.push(word);
      parts.push({ text: word, type: "subject" });
    }
  });

  return { wants, parts };
}

module.exports = { readSentence, words };
