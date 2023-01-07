const controller = require("../CONTROLLERS/group-request-controller");
const express = require("express");
const router = express.Router();

router
  .route("/")
  .patch(controller.acceptRequest)
  .post(controller.createRequest)
  .delete(controller.rejectRequest)
  .get(controller.getAllRequest);
router.route("/:request_id").delete(controller.cancelRequest);

module.exports = router;
