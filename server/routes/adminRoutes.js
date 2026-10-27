const express = require("express");
const checkLogin = require("../middleware/checkLogin");
const checkAdmin = require("../middleware/checkAdmin");
const uploadImage = require("../middleware/uploadImage");
const overview = require("../controllers/adminOverviewController");
const paintings = require("../controllers/adminPaintingController");
const tools = require("../controllers/adminToolsController");

const router = express.Router();

router.use(checkLogin, checkAdmin);
router.get("/overview", overview.getOverview);
router.get("/paintings", paintings.listPaintings);
router.post("/paintings", uploadImage.single("image"), paintings.createPainting);
router.post("/paintings/bulk", tools.bulk);
router.put("/paintings/:slug", uploadImage.single("image"), paintings.updatePainting);
router.delete("/paintings/:slug", paintings.deletePainting);
router.post("/paintings/:slug/labels", tools.labels);
router.post("/paintings/:slug/story", tools.story);

module.exports = router;
