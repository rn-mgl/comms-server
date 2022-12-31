const controller = require("../CONTROLLERS/group-message-controller");
const express = require("express");
const router = express.Router();

router.route("/msg/:message_id").post(controller.replyToMessage).patch(controller.deleteMessage);
router
  .route("/room/:room_code")
  .get(controller.getAllGroupMessage)
  .post(controller.sendMessage)
  .patch(controller.unsendMessage);
router.route("/fns/:room_code").get(controller.getLatestGroupMessage);

module.exports = router;
