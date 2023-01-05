const controller = require("../CONTROLLERS/direct-messages-controller");
const express = require("express");
const router = express.Router();

router.route("/msg/:message_id").patch(controller.deleteMessage);
router
  .route("/room/:room_code")
  .get(controller.getAllDirectMessage)
  .post(controller.sendMessage)
  .patch(controller.unsendMessage);
router.route("/fns/:room_code").get(controller.getLatestDirectMessage);
module.exports = router;
