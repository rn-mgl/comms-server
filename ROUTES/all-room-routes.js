const controller = require("../CONTROLLERS/all-room-controller");
const express = require("express");
const router = express.Router();

router.route("/").get(controller.getAllRooms);

module.exports = router;
