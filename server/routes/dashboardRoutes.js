const express = require("express");
const checkLogin = require("../middleware/checkLogin");
const { getDashboard } = require("../controllers/dashboardController");

const router = express.Router();

router.get("/", checkLogin, getDashboard);

module.exports = router;
