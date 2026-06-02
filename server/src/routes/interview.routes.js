const express = require("express");
const { protect } = require("../middlewares/auth.middleware");
const { start, submit, history } = require("../controllers/interview.controller");

const router = express.Router();

router.route("/start").post(protect, start);
router.route("/:sessionId/submit").post(protect, submit);
router.route("/history").get(protect, history);

module.exports = router;