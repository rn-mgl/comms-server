const { StatusCodes } = require("http-status-codes");
const Notes = require("../MODELS/Notes");
const { BadRequestError, NotFoundError } = require("../ERRORS");

const createNote = async (req, res) => {
  const { id } = req.user;
  const { note_title, note_content, note_file } = req.body;

  const note = new Notes(id, note_title, note_content, note_file);

  const data = await note.createNote();

  if (!data) {
    throw new BadRequestError(`Error in creating note.`);
  }

  res.status(StatusCodes.OK).json(data);
};

const updateNote = async (req, res) => {
  const { id } = req.user;
  const { note_id } = req.params;
  const { note_title, note_content, note_file } = req.body;

  const note = new Notes(id, note_title, note_content, note_file);

  const data = await note.updateNote(note_id);

  if (!data) {
    throw new BadRequestError(`Error in creating note.`);
  }

  res.status(StatusCodes.OK).json(data);
};

const deleteNote = async (req, res) => {
  const { id } = req.user;
  const { note_id } = req.params;

  const data = await Notes.deleteNote(note_id, id);

  if (!data) {
    throw new BadRequestError(`Error in deleting note. Try again later.`);
  }

  res.status(StatusCodes.OK).json(data);
};

const deleteMultipleNotes = async (req, res) => {
  const { id } = req.user;
  const { note_ids } = req.body;

  const data = await Notes.deleteMultipleNotes(note_ids, id);

  if (!data) {
    throw new BadRequestError(`Error in delete multiple notes. Try again later.`);
  }

  res.status(StatusCodes.OK).json(data);
};

const getAllNotes = async (req, res) => {
  const { id } = req.user;

  const data = await Notes.getAllNotes(id);

  if (!data) {
    throw new NotFoundError(`Error in getting all notes. Try again later.`);
  }

  res.status(StatusCodes.OK).json(data);
};

const getNote = async (req, res) => {
  const { note_id } = req.params;

  const data = await Notes.getNote(note_id);

  if (!data) {
    throw new NotFoundError(`Error in getting note. Try again later.`);
  }

  res.status(StatusCodes.OK).json(data[0]);
};

module.exports = { createNote, updateNote, deleteNote, deleteMultipleNotes, getAllNotes, getNote };
