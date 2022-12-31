const controller = require("../CONTROLLERS/direct-room-controller");
const express = require("express");
const router = express.Router();

router
  .route("/")
  .post(controller.addFriend)
  .delete(controller.removeFriend)
  .get(controller.getAllDirectRoom);
router.route("/:room_code").get(controller.getDirectRoom);
router.route("/psv/:room_code").patch(controller.closeRoom);
router.route("/mnl/:room_code").patch(controller.unseenRoom);

module.exports = router;
