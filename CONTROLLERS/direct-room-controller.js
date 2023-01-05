const { StatusCodes } = require("http-status-codes");
const { BadRequestError, NotFoundError } = require("../ERRORS");
const DirectRoom = require("../MODELS/DirectRoom");
const crypto = require("crypto");
const RoomFunctions = require("../MODELS/FUNCTIONS/RoomFunctions");

const addFriend = async (req, res) => {
  const { email } = req.body;
  const { id } = req.user;

  const roomCode = crypto.randomBytes(50).toString("hex");

  const data = await DirectRoom.addUserEmail(email, id, roomCode);

  if (!data) {
    throw new BadRequestError(`Error in adding and creating room.`);
  }

  res.status(StatusCodes.OK).json(data);
};

const removeFriend = async (req, res) => {
  const { room_code } = req.body;

  const data = await DirectRoom.unfriendUser(room_code);

  if (!data) {
    throw new BadRequestError(`Error in unfriending. Try again later.`);
  }

  res.status(StatusCodes.OK).json(data);
};

const getDirectRoom = async (req, res) => {
  const { id } = req.user;
  const { room_code } = req.params;

  const data = await DirectRoom.getDirectRoom(room_code, id);

  if (!data) {
    throw new BadRequestError(`Error in getting chat.`);
  }

  const open = await RoomFunctions.openDirectRoom(id, room_code);

  if (!open) {
    throw new BadRequestError(`Error in opening chat.`);
  }

  const seen = await RoomFunctions.seeDirectRoom(id, room_code);

  if (!seen) {
    throw new BadRequestError(`Error in seening chat.`);
  }

  res.status(StatusCodes.OK).json(data[0]);
};

const getAllDirectRoom = async (req, res) => {
  const { id } = req.user;

  const data = await DirectRoom.getAllDirectRoom(id);

  if (!data) {
    throw new BadRequestError(`Error in getting all friends.`);
  }

  res.status(StatusCodes.OK).json(data);
};

const seenRoom = async (req, res) => {
  const { room_code } = req.params;
  const { member_id } = req.body;

  const data = await RoomFunctions.seeDirectRoom(member_id, room_code);

  if (!data) {
    throw new BadRequestError(`Error in entering room.`);
  }

  res.status(StatusCodes.OK).json(data);
};

const closeRoom = async (req, res) => {
  const { id } = req.user;
  const { room_code } = req.params;

  const data = await RoomFunctions.closeDirectRoom(id, room_code);

  if (!data) {
    throw new BadRequestError(`Error in closing room. Try again later.`);
  }

  res.status(StatusCodes.OK).json(data);
};

const muteRoom = async (req, res) => {
  const { id } = req.user;
  const { room_code } = req.params;

  const data = await RoomFunctions.muteDirectRoom(id, room_code);

  if (!data) {
    throw new BadRequestError(`Error in muting the room. Try again later.`);
  }

  res.status(StatusCodes.OK).json(data);
};

const blockRoom = async (req, res) => {
  const { id } = req.user;
  const { room_code } = req.body;

  const data = await RoomFunctions.blockDirectRoom(id, room_code);

  if (!data) {
    throw new BadRequestError(`Error in blocking the room. Try again later.`);
  }

  res.status(StatusCodes.OK).json(data);
};

const getAllBlockedRoom = async (req, res) => {
  const { id } = req.user;

  const data = await DirectRoom.getAllBlockedRoom(id);

  if (!data) {
    throw new BadRequestError(`Error in getting all blocked rooms. Try again later.`);
  }

  res.status(StatusCodes.OK).json(data);
};

module.exports = {
  addFriend,
  removeFriend,
  getDirectRoom,
  getAllDirectRoom,
  seenRoom,
  closeRoom,
  muteRoom,
  blockRoom,
  getAllBlockedRoom,
};
