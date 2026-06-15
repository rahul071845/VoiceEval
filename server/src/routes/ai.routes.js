const express = require("express");
const { protect } = require("../middlewares/auth.middleware");
const { testGemini, testGeminiEvaluate, testFirstQues, testNextQues, testSummary } = require("../controllers/ai.controller");

const router = express.Router();

router.route("/test-gemini").get(protect, testGemini);
router.route("/evaluate-test").get(protect, testGeminiEvaluate);
router.route("/first-ques-test").get(protect, testFirstQues);
router.route("/next-ques-test").get(protect, testNextQues);
router.route("/summary-test").get(protect, testSummary);

module.exports = router;