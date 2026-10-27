const express = require("express");
const artists = require("../controllers/artistController");

const router = express.Router();

router.get("/", artists.listArtists);
router.get("/:slug", artists.getArtist);

module.exports = router;
