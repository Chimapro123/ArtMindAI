const express = require("express");
const findUser = require("../middleware/findUser");
const checkLogin = require("../middleware/checkLogin");
const collections = require("../controllers/collectionController");

const router = express.Router();

router.get("/", findUser, collections.listCollections);
router.get("/:slug", findUser, collections.getCollection);
router.post("/", checkLogin, collections.createCollection);
router.post("/:slug/paintings", checkLogin, collections.addPainting);

module.exports = router;
