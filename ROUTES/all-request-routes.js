const controller = require("../CONTROLLERS/all-request-controller");
const express = require("express");
const router = express.Router();

router.route("/").get(controller.getCountAllUnseenReceivedRequests);

module.exports = router;
