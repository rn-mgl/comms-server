const { StatusCodes } = require("http-status-codes");
const { BadRequestError } = require("../ERRORS");
const RoomFunctions = require("../MODELS/FUNCTIONS/RoomFunctions");
const GroupMessage = require("../MODELS/GroupMessage");

const sendMessage = async (req, res) => {
  const { id } = req.user;
  const { room_code } = req.params;
  const { room_id, message_content, message_file } = req.body;

  const message = new GroupMessage(id, room_id, room_code, message_content, message_file);
  const data = await message.sendMessage();

  if (!data) {
    throw new BadRequestError(`Error in sending message. Try again later.`);
  }

  const unseeRoom = await RoomFunctions.unseeGroupRoom(id, room_code);

  if (!unseeRoom) {
    throw new BadRequestError(`Error in unseeing room. Try again later.`);
  }

  res.status(StatusCodes.OK).json(data);
};

const unsendMessage = async (req, res) => {
  const { message_id } = req.body;

  const data = await GroupMessage.unsendMessage(message_id);

  if (!data) {
    throw new BadRequestError(`Error in unsending message. Try again later.`);
  }

  res.status(StatusCodes.OK).json(data);
};

const replyToMessage = async (req, res) => {
  const { id } = req.user;
  const { message_id } = req.params;
  const { room_id, room_code, message_content, message_file } = req.body;

  const message = new GroupMessage(id, room_id, room_code, message_content, message_file);

  const data = await message.replyToMessage(message_id);

  if (!data) {
    throw new BadRequestError(`Error in replying to message.`);
  }

  res.status(StatusCodes.OK).json(data);
};

const deleteMessage = async (req, res) => {
  const { message_id } = req.params;

  const data = await GroupMessage.deleteMessage(message_id);

  if (!data) {
    throw new BadRequestError(`Error in deleting message. Try again later.`);
  }

  res.status(StatusCodes.OK).json(data);
};

const getAllGroupMessage = async (req, res) => {
  const { room_code } = req.params;

  const data = await GroupMessage.getAllGroupMessage(room_code);

  if (!data) {
    throw new BadRequestError(`Error in getting all messages.`);
  }

  res.status(StatusCodes.OK).json(data);
};

const getLatestGroupMessage = async (req, res) => {
  const { room_code } = req.params;

  const data = await GroupMessage.getLatestGroupMessage(room_code);

  if (!data) {
    throw new BadRequestError(`Error in getting message.`);
  }

  res.status(StatusCodes.OK).json(data);
};

module.exports = {
  sendMessage,
  unsendMessage,
  replyToMessage,
  deleteMessage,
  getAllGroupMessage,
  getLatestGroupMessage,
};
