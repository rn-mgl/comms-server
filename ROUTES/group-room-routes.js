const controller = require("../CONTROLLERS/group-room-controller");
const express = require("express");
const router = express.Router();

router
  .route("/")
  .post(controller.createGroupRoom)
  .patch(controller.leaveGroup)
  .get(controller.getAllGroupRoom);
router
  .route("/:room_code")
  .post(controller.addGroupMember)
  .patch(controller.removeMember)
  .get(controller.getGroupRoom);
router.route("/psv/:room_code").patch(controller.closeRoom);
router.route("/mnl/:room_code").patch(controller.unseenRoom);

module.exports = router;
