const express = require("express");
const checkLogin = require("../middleware/checkLogin");
const { guideLimit } = require("../middleware/limits");
const guide = require("../controllers/guideController");

const router = express.Router();

router.use(checkLogin);
router.post("/ask", guideLimit, guide.ask);
router.get("/conversations", guide.listConversations);
router.get("/conversations/:id", guide.getConversation);

module.exports = router;
