const controller = require("../CONTROLLERS/user-controller");
const express = require("express");
const router = express.Router();

router.route("/").patch(controller.updateUser);
router.route("/logout").patch(controller.logoutUser);

module.exports = router;
