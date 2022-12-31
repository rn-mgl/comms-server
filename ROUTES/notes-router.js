const controller = require("../CONTROLLERS/notes-controller");
const express = require("express");
const router = express.Router();

router
  .route("/")
  .get(controller.getAllNotes)
  .post(controller.createNote)
  .delete(controller.deleteMultipleNotes);

router
  .route("/:note_id")
  .get(controller.getNote)
  .patch(controller.updateNote)
  .delete(controller.deleteNote);

module.exports = router;
