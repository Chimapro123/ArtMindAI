require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const path = require("path");
const connectDb = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const profileRoutes = require("./routes/profileRoutes");
const homeRoutes = require("./routes/homeRoutes");
const paintingRoutes = require("./routes/paintingRoutes");
const artistRoutes = require("./routes/artistRoutes");
const collectionRoutes = require("./routes/collectionRoutes");
const savedRoutes = require("./routes/savedRoutes");
const searchRoutes = require("./routes/searchRoutes");
const guideRoutes = require("./routes/guideRoutes");
const imageLabRoutes = require("./routes/imageLabRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const adminRoutes = require("./routes/adminRoutes");
const imageRoutes = require("./routes/imageRoutes");
const { contactRouter, newsletterRouter, visitRouter } = require("./routes/contactRoutes");

const app = express();
const port = process.env.PORT || 5000;

connectDb();

app.use(cors({ origin: process.env.CLIENT_URL || "http://localhost:5173", credentials: true }));
app.use(express.json({ limit: "1mb" }));
app.use(cookieParser());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.get("/api/health", (request, response) => {
  response.json({ status: "ok" });
});

app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/home", homeRoutes);
app.use("/api/paintings", paintingRoutes);
app.use("/api/artists", artistRoutes);
app.use("/api/collections", collectionRoutes);
app.use("/api/saved", savedRoutes);
app.use("/api/search", searchRoutes);
app.use("/api/guide", guideRoutes);
app.use("/api/image-lab", imageLabRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/images", imageRoutes);
app.use("/api/contact", contactRouter);
app.use("/api/newsletter", newsletterRouter);
app.use("/api/visits", visitRouter);

app.use("/api", (request, response) => {
  response.status(404).json({ message: "That route does not exist" });
});

app.use((error, request, response, next) => {
  if (error.code === "LIMIT_FILE_SIZE") {
    return response.status(400).json({ message: "That file is too big. Keep it under 5 MB" });
  }
  if (error.message && error.message.startsWith("Please choose")) {
    return response.status(400).json({ message: error.message });
  }
  if (error.type === "entity.parse.failed") {
    return response.status(400).json({ message: "That request was not proper JSON" });
  }
  console.log(error.message);
  response.status(500).json({ message: "Something went wrong on our side. Please try again" });
});

app.listen(port, () => {
  console.log("Server running on port " + port);
});
