require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const connectDb = require("./config/db");

const app = express();
const port = process.env.PORT || 5000;

connectDb();

app.use(cors({ origin: process.env.CLIENT_URL || "http://localhost:5173", credentials: true }));
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.get("/api/health", (request, response) => {
  response.json({ status: "ok" });
});

app.listen(port, () => {
  console.log("Server running on port " + port);
});
