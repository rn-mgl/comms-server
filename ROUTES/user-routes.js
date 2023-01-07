const controller = require("../CONTROLLERS/user-controller");
const express = require("express");
const router = express.Router();

router.route("/").patch(controller.updateUser).get(controller.getAllUsersForRequest);
router.route("/:user_id").get(controller.getUser);
router.route("/mnl/user").get(controller.getAllFriends).patch(controller.logoutUser);
router.route("/all/user").get(controller.getAllUsers);

module.exports = router;
