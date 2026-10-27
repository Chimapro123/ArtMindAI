const defaultCollections = [
  {
    slug: "good-dogs",
    title: "Good dogs",
    line: "Every painting in this room has a dog in it somewhere. Some are easier to spot than others.",
    lead: "the-arnolfini-portrait",
    items: [
      { painting: "the-arnolfini-portrait", note: "Right at their feet, looking straight at you.", x: 47, y: 88 },
      { painting: "las-meninas", note: "The big dog lying in front, about to be nudged by a boy's foot.", x: 74, y: 88 },
      { painting: "hunters-in-the-snow", note: "A whole pack, tired and hungry, at the hunters' heels.", x: 12, y: 80 },
      { painting: "the-night-watch", note: "Bottom right, barking at the drummer.", x: 83, y: 86 },
      { painting: "a-boy-caring-for-his-dog", note: "The easy one. The boy is picking fleas from its coat.", x: 56, y: 70 }
    ]
  },
  {
    slug: "real-gold",
    title: "Real gold",
    line: "Paintings with actual gold leaf on them.",
    lead: "the-kiss",
    items: [
      { painting: "the-kiss", note: "" },
      { painting: "maesta", note: "" },
      { painting: "the-annunciation-simone-martini", note: "" },
      { painting: "the-annunciation-fra-angelico", note: "" }
    ]
  },
  {
    slug: "weather",
    title: "Weather",
    line: "Snow, fog, storms and the odd rainbow.",
    lead: "rain-steam-and-speed",
    items: [
      { painting: "rain-steam-and-speed", note: "" },
      { painting: "the-ninth-wave", note: "" },
      { painting: "hunters-in-the-snow", note: "" },
      { painting: "wanderer-above-the-sea-of-fog", note: "" },
      { painting: "salisbury-cathedral-from-the-meadows", note: "" },
      { painting: "the-gloomy-day", note: "" },
      { painting: "winter-landscape-with-skaters", note: "" }
    ]
  },
  {
    slug: "night",
    title: "Night",
    line: "Painted after dark, or pretending to be.",
    lead: "cafe-terrace-at-night",
    items: [
      { painting: "cafe-terrace-at-night", note: "" },
      { painting: "the-starry-night", note: "" },
      { painting: "starry-night-over-the-rhone", note: "" },
      { painting: "moonrise-over-the-sea", note: "" },
      { painting: "the-night-watch", note: "" }
    ]
  },
  {
    slug: "people-at-work",
    title: "People at work",
    line: "Milking, harvesting, sewing and gleaning.",
    lead: "the-milkmaid",
    items: [
      { painting: "the-milkmaid", note: "" },
      { painting: "the-gleaners", note: "" },
      { painting: "the-harvesters", note: "" },
      { painting: "the-lacemaker", note: "" },
      { painting: "young-woman-with-a-water-pitcher", note: "" }
    ]
  }
];

module.exports = defaultCollections;
