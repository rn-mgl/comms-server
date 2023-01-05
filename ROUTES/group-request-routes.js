const controller = require("../CONTROLLERS/group-request-controller");
const express = require("express");
const router = express.Router();

router
  .route("/")
  .post(controller.createRequest)
  .patch(controller.rejectRequest)
  .get(controller.getAllRequest);
router.route("/:request_id").patch(controller.acceptRequest).delete(controller.cancelRequest);

module.exports = router;
