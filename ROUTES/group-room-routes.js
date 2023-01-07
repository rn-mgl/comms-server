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
  .get(controller.getGroupRoom)
  .delete(controller.deleteGroup);

router.route("/blck/rm").patch(controller.blockRoom);
router.route("/mt/rm").patch(controller.muteRoom);

router.route("/psv/:room_code").patch(controller.closeRoom);
router.route("/mnl/:room_code").get(controller.getAllMembers).post(controller.joinRoom);

module.exports = router;
