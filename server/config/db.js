const mongoose = require("mongoose");

async function connectDb() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to the database");
  } catch (error) {
    console.log("Could not connect to the database");
    console.log(error.message);
  }
}

module.exports = connectDb;
