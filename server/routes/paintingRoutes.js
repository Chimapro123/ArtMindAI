const express = require("express");
const findUser = require("../middleware/findUser");
const paintings = require("../controllers/paintingController");

const router = express.Router();

router.get("/", findUser, paintings.listPaintings);
router.get("/:slug", findUser, paintings.getPainting);
router.post("/:slug/view", findUser, paintings.viewPainting);

module.exports = router;
