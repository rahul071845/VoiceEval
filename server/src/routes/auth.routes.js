const express = require("express");
const { register, login, trial } = require("../controllers/auth.controller");
const { protect } = require("../middlewares/auth.middleware");

const router = express.Router();

router.route("/register").post(register);
router.route("/login").post(login);
router.route("/me").get(protect, trial);

module.exports = router;