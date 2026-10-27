const express = require("express");
const checkLogin = require("../middleware/checkLogin");
const uploadImage = require("../middleware/uploadImage");
const profile = require("../controllers/profileController");

const router = express.Router();

router.use(checkLogin);
router.get("/", profile.getProfile);
router.put("/", profile.updateProfile);
router.post("/photo", uploadImage.single("photo"), profile.uploadPhoto);
router.put("/password", profile.changePassword);
router.put("/emails", profile.updateEmails);
router.delete("/", profile.closePass);

module.exports = router;
