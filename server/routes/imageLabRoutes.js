const express = require("express");
const checkLogin = require("../middleware/checkLogin");
const uploadImage = require("../middleware/uploadImage");
const { labLimit } = require("../middleware/limits");
const imageLab = require("../controllers/imageLabController");

const router = express.Router();

router.use(checkLogin);
router.post("/check", labLimit, uploadImage.single("image"), imageLab.checkImage);
router.get("/history", imageLab.history);

module.exports = router;
