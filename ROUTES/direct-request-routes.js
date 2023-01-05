const controller = require("../CONTROLLERS/direct-request-controller");
const express = require("express");
const router = express.Router();

router
  .route("/")
  .post(controller.createRequest)
  .patch(controller.acceptRequest)
  .delete(controller.rejectRequest)
  .get(controller.getAllRequest);
router.route("/:request_id").delete(controller.cancelRequest);

module.exports = router;
