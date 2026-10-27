require("dotenv").config();
const mongoose = require("mongoose");
const Painting = require("./models/Painting");
const Artist = require("./models/Artist");
const { askText } = require("./utils/askModel");
const { writeStory } = require("./controllers/adminToolsController");
const { tidyAnswer } = require("./utils/guideHelpers");

const pauseMs = 4000;

function pause() {
  return new Promise((resolve) => setTimeout(resolve, pauseMs));
}

async function writeStories() {
  const paintings = await Painting.find({ story: "" }).sort({ title: 1 });
  console.log("Paintings without a story: " + paintings.length);
  for (const painting of paintings) {
    const story = await writeStory(painting);
    painting.story = story;
    await painting.save();
    console.log("Story written for " + painting.title);
    await pause();
  }
}

async function writeBios() {
  const artists = await Artist.find({ bio: "" }).sort({ name: 1 });
  console.log("Artists without a bio: " + artists.length);
  for (const artist of artists) {
    const theirs = await Painting.find({ artistSlug: artist.slug }).select("title year");
    const list = theirs.map((painting) => painting.title + " (" + painting.year + ")").join(", ");
    const prompt =
      "Write two or three plain, friendly sentences about this painter for a visitor who knows nothing about art. No dashes, no lists. " +
      "Name: " + artist.name + ". Born " + artist.born + ", died " + artist.died + ". Nationality: " + artist.nationality + ". Style: " + artist.era + ". " +
      "Paintings in our gallery: " + list + ".";
    const text = await askText(prompt, "You write short, friendly museum labels in plain English.", { maxTokens: 600 });
    if (!text) {
      console.log("No answer from the model for " + artist.name + ", skipping");
      continue;
    }
    artist.bio = tidyAnswer(text);
    await artist.save();
    console.log("Bio written for " + artist.name);
    await pause();
  }
}

async function run() {
  if (!process.env.MODEL_API_KEY) {
    console.log("MODEL_API_KEY is empty, so stories would only be plain templates. Fill it in and run again.");
    return;
  }
  try {
    await mongoose.connect(process.env.MONGO_URI);
    await writeStories();
    await writeBios();
    console.log("Stories done");
  } catch (error) {
    console.log("Stories failed: " + error.message);
  }
  await mongoose.disconnect();
}

run();
