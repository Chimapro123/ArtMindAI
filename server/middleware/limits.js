const rateLimit = require("express-rate-limit");

function makeLimit(max, message) {
  return rateLimit({
    windowMs: 15 * 60 * 1000,
    max,
    standardHeaders: true,
    legacyHeaders: false,
    message: { message }
  });
}

const authLimit = makeLimit(40, "Too many tries. Please wait a little and try again.");
const searchLimit = makeLimit(80, "That is a lot of searching. Please wait a little and try again.");
const guideLimit = makeLimit(80, "The guide needs a short rest. Please try again in a few minutes.");
const labLimit = makeLimit(25, "That is a lot of photos. Please wait a little and try again.");

module.exports = { authLimit, searchLimit, guideLimit, labLimit };
