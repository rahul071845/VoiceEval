const express = require("express");
const { protect } = require("../middlewares/auth.middleware");
const { testGemini } = require("../controllers/ai.controller");

const router = express.Router();

router.route("/test-gemini").get(protect, testGemini);

module.exports = router;