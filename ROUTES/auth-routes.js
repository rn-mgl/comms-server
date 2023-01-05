const controller = require("../CONTROLLERS/auth-controller");
const express = require("express");
const router = express.Router();

router.route("/").get(controller.loginUser).post(controller.signUpUser);
router.route("/verification/:token").patch(controller.confirmUser);

module.exports = router;
