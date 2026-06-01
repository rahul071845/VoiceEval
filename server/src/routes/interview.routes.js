const express = require("express");
const { protect } = require("../middlewares/auth.middleware");
const { start } = require("../controllers/interview.controller");

const router = express.Router();

router.route("/start").post(protect, start);

module.exports = router;