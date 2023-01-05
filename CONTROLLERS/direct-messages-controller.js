const { StatusCodes } = require("http-status-codes");
const { BadRequestError } = require("../ERRORS");
const DirectMessage = require("../MODELS/DirectMessage");
const RoomFunctions = require("../MODELS/FUNCTIONS/RoomFunctions");

const sendMessage = async (req, res) => {
  const { id } = req.user;
  const { room_code } = req.params;
  const { room_id, message_content, message_file, reply_to } = req.body;

  const message = new DirectMessage(
    id,
    room_id,
    room_code,
    message_content,
    message_file,
    reply_to
  );

  const data = await message.sendMessage();

  if (!data) {
    throw new BadRequestError(`Error in sending message. Try again later.`);
  }

  const unseeRoom = await RoomFunctions.unseeDirectRoom(id, room_code);

  if (!unseeRoom) {
    throw new BadRequestError(`Error in unseeing message. Try again later.`);
  }

  const updateRoom = await RoomFunctions.updateDirectRoomDate(room_code);

  if (!updateRoom) {
    throw new BadRequestError(`Error in updating room. Try again later.`);
  }

  res.status(StatusCodes.OK).json(data);
};

const unsendMessage = async (req, res) => {
  const { message_id } = req.body;

  const data = await DirectMessage.unsendMessage(message_id);

  if (!data) {
    throw new BadRequestError(`Error in unsending message. Try again later.`);
  }

  res.status(StatusCodes.OK).json(data);
};

const deleteMessage = async (req, res) => {
  const { message_id } = req.params;

  const data = await DirectMessage.deleteMessage(message_id);

  if (!data) {
    throw new BadRequestError(`Error in deleting message. Try again later.`);
  }

  res.status(StatusCodes.OK).json(data);
};

const getAllDirectMessage = async (req, res) => {
  const { room_code } = req.params;
  const { limit } = req.query;

  const data = await DirectMessage.getAllDirectMessage(room_code, limit);

  if (!data) {
    throw new BadRequestError(`Error in getting all messages.`);
  }

  res.status(StatusCodes.OK).json(data);
};

const getLatestDirectMessage = async (req, res) => {
  const { room_code } = req.params;

  const data = await DirectMessage.getLatestDirectMessage(room_code);

  if (!data) {
    throw new BadRequestError(`Error in getting message.`);
  }

  res.status(StatusCodes.OK).json(data);
};

module.exports = {
  sendMessage,
  unsendMessage,
  deleteMessage,
  getAllDirectMessage,
  getLatestDirectMessage,
};
