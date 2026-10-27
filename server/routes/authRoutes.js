const express = require("express");
const checkLogin = require("../middleware/checkLogin");
const { authLimit } = require("../middleware/limits");
const auth = require("../controllers/authController");
const reset = require("../controllers/resetController");

const router = express.Router();

router.post("/register", authLimit, auth.register);
router.post("/verify-email", authLimit, auth.verifyEmail);
router.post("/resend-code", authLimit, auth.resendCode);
router.post("/login", authLimit, auth.login);
router.post("/logout", auth.logout);
router.get("/me", checkLogin, auth.me);
router.post("/forgot-password", authLimit, reset.forgotPassword);
router.post("/check-reset-code", authLimit, reset.checkResetCode);
router.post("/reset-password", authLimit, reset.resetPassword);

module.exports = router;
