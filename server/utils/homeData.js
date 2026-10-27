const rooms = [
  { name: "Abstract", slug: "composition-vii", description: "Colour and shape with no story needed" },
  { name: "Landscape", slug: "the-hay-wain", description: "Fields, rivers and big skies" },
  { name: "Flower", slug: "sunflowers", description: "Vases, gardens and still lifes" },
  { name: "Nature", slug: "young-hare", description: "Animals, waves and mountains" },
  { name: "Figurative", slug: "girl-with-a-pearl-earring", description: "People, letters and quiet rooms" },
  { name: "Religious", slug: "madonna-of-the-meadow", description: "Gold, angels and old stories" }
];

const timeline = [
  { slug: "maesta", style: "Gothic", era: "1300s" },
  { slug: "the-school-of-athens", style: "Renaissance", era: "1500s" },
  { slug: "the-night-watch", style: "Baroque", era: "1600s" },
  { slug: "the-fighting-temeraire", style: "Romanticism", era: "1830s" },
  { slug: "luncheon-of-the-boating-party", style: "Impressionism", era: "1880s" },
  { slug: "the-starry-night", style: "Post Impressionism", era: "1880s" },
  { slug: "composition-vii", style: "Modern", era: "1910s" }
];

const heroSlug = "the-milkmaid";
const lookCloserSlug = "the-arnolfini-portrait";
const regularSlug = "the-love-letter";

module.exports = { rooms, timeline, heroSlug, lookCloserSlug, regularSlug };
