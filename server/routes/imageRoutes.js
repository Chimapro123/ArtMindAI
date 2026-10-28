const express = require("express");
const images = require("../controllers/imageController");

const router = express.Router();

router.get("/:id", images.getImage);

module.exports = router;
