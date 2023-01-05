const controller = require("../CONTROLLERS/user-controller");
const express = require("express");
const router = express.Router();

router.route("/").patch(controller.updateUser).get(controller.getAllUsers);
router.route("/:user_id").get(controller.getUser);
router.route("/mnl/logout").patch(controller.logoutUser);

module.exports = router;
