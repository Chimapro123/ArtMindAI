const express = require("express");
const findUser = require("../middleware/findUser");
const { searchLimit } = require("../middleware/limits");
const { search } = require("../controllers/searchController");

const router = express.Router();

router.post("/", searchLimit, findUser, search);

module.exports = router;
