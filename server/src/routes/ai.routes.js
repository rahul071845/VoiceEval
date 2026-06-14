const express = require("express");
const { protect } = require("../middlewares/auth.middleware");
const { testGemini, testGeminiEvaluate } = require("../controllers/ai.controller");

const router = express.Router();

router.route("/test-gemini").get(protect, testGemini);
router.route("/evaluate-test").get(protect, testGeminiEvaluate);

module.exports = router;