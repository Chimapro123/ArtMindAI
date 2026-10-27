const express = require("express");
const findUser = require("../middleware/findUser");
const contact = require("../controllers/contactController");

const contactRouter = express.Router();
contactRouter.post("/", contact.sendMessage);

const newsletterRouter = express.Router();
newsletterRouter.post("/", contact.subscribe);

const visitRouter = express.Router();
visitRouter.post("/", findUser, contact.recordVisit);

module.exports = { contactRouter, newsletterRouter, visitRouter };
