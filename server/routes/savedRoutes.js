const express = require("express");
const checkLogin = require("../middleware/checkLogin");
const saved = require("../controllers/savedController");

const router = express.Router();

router.use(checkLogin);
router.get("/", saved.listSaved);
router.post("/:slug", saved.savePainting);
router.delete("/:slug", saved.unsavePainting);

module.exports = router;
