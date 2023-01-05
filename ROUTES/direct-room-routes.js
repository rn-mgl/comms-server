const controller = require("../CONTROLLERS/direct-room-controller");
const express = require("express");
const router = express.Router();

router
  .route("/")
  .post(controller.addFriend)
  .delete(controller.removeFriend)
  .get(controller.getAllDirectRoom);

router.route("/:room_code").get(controller.getDirectRoom);

router.route("/blck/rm").get(controller.getAllBlockedRoom).patch(controller.blockRoom);
router.route("/mt/rm").patch(controller.muteRoom);

router.route("/psv/:room_code").patch(controller.closeRoom);

module.exports = router;
