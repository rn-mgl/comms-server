const controller = require("../CONTROLLERS/upload-controller");
const express = require("express");
const router = express.Router();

router.route("/").post(controller.uploadFile);

module.exports = router;
