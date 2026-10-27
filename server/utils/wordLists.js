const roomWords = {
  Abstract: ["abstract", "shapes", "geometric", "squares", "circles", "lines", "grid"],
  Landscape: ["landscape", "field", "fields", "river", "countryside", "hills", "village", "meadow", "wheat", "sky", "skies"],
  Flower: ["flower", "flowers", "bouquet", "vase", "roses", "tulips", "blossom", "garden", "sunflowers", "irises"],
  Nature: ["nature", "animal", "animals", "hare", "tiger", "horse", "horses", "wave", "waves", "mountain", "mountains", "sea", "moon", "fog", "deer"],
  Figurative: ["people", "person", "woman", "women", "man", "men", "girl", "boy", "portrait", "reading", "letter", "dog", "party", "couple", "face", "kitchen"],
  Religious: ["religious", "madonna", "virgin", "mary", "saint", "angel", "angels", "annunciation", "jesus", "god", "bible", "church", "prayer", "holy"]
};

const colourWords = {
  Ultramarine: ["blue", "navy", "blues"],
  Vermilion: ["red", "scarlet", "crimson", "reds"],
  "Yellow ochre": ["yellow", "gold", "golden", "ochre", "amber"],
  Viridian: ["green", "greens", "emerald"],
  "Lead white": ["white", "pale", "snow", "cream"],
  "Ivory black": ["black", "dark", "shadow", "shadows"],
  "Burnt umber": ["brown", "earthy", "earth"],
  "Rose madder": ["pink", "rose", "blush"],
  "Slate grey": ["grey", "gray", "silver"]
};

const moodWords = {
  calm: ["calm", "quiet", "peaceful", "still", "gentle", "serene", "soft", "relaxing", "restful", "slow"],
  stormy: ["storm", "stormy", "wild", "rough", "angry", "violent", "crashing"],
  dramatic: ["dramatic", "drama", "powerful", "intense", "bold", "epic"],
  joyful: ["happy", "joy", "joyful", "cheerful", "bright", "sunny", "fun", "lively", "warm"],
  dark: ["sad", "gloomy", "lonely", "dark", "moody", "melancholy", "cold"],
  dreamy: ["dream", "dreamy", "mysterious", "strange", "magical", "misty", "hazy"]
};

const styleNames = ["Renaissance", "Northern Renaissance", "Gothic", "Baroque", "Romanticism", "Realism", "Impressionism", "Post Impressionism", "Ukiyo-e", "Modern"];

const mediumNames = ["Oil", "Tempera", "Fresco", "Watercolour", "Pastel", "Woodblock print"];

const eraWords = [
  { words: ["1300s", "14th century", "medieval", "middle ages"], from: 1300, to: 1399 },
  { words: ["1400s", "15th century"], from: 1400, to: 1499 },
  { words: ["1500s", "16th century"], from: 1500, to: 1599 },
  { words: ["1600s", "17th century"], from: 1600, to: 1699 },
  { words: ["1700s", "18th century"], from: 1700, to: 1799 },
  { words: ["1800s", "19th century", "victorian"], from: 1800, to: 1899 },
  { words: ["1900s", "20th century", "last century"], from: 1900, to: 1999 },
  { words: ["old", "ancient", "very old"], from: 1300, to: 1600 },
  { words: ["recent", "new", "newer"], from: 1880, to: 1999 }
];

const skipWords = ["a", "an", "the", "of", "in", "on", "with", "and", "or", "something", "painting", "paintings", "picture", "pictures", "like", "some", "any", "that", "has", "have", "is", "it", "to", "for", "me", "i", "want", "show", "find", "by", "from", "at", "somewhere", "more", "very", "really", "kind", "sort", "please", "one", "ones"];

module.exports = { roomWords, colourWords, moodWords, styleNames, mediumNames, eraWords, skipWords };
