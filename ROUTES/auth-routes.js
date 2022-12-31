const controller = require("../CONTROLLERS/auth-controller");
const express = require("express");
const router = express.Router();

router.route("/signup").post(controller.signUpUser);
router.route("/login").post(controller.loginUser);
router.route("/verification/:token").patch(controller.confirmUser);

module.exports = router;
