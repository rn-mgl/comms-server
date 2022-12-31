const { StatusCodes } = require("http-status-codes");
const { BadRequestError } = require("../ERRORS");
const GroupRoom = require("../MODELS/GroupRoom");
const crypto = require("crypto");
const RoomFunctions = require("../MODELS/FUNCTIONS/RoomFunctions");

const createGroupRoom = async (req, res) => {
  const { group_name } = req.body;
  const { id } = req.user;

  const roomCode = crypto.randomBytes(50).toString("hex");

  const group = new GroupRoom(roomCode, id, group_name);

  const data = await group.createGroupRoom();

  if (!data) {
    throw new BadRequestError(`Error in making group. Try again later.`);
  }

  res.status(StatusCodes.OK).json(data);
};

const addGroupMember = async (req, res) => {
  const { member_email, theme, group_name } = req.body;
  const { room_code } = req.params;

  const memberCheck = await GroupRoom.checkIfMember(member_email, room_code);

  if (memberCheck[0].member_already) {
    const reAddData = await GroupRoom.reAddMember(member_email, room_code);
    res.status(StatusCodes.OK).json(reAddData);
    return;
  }

  const data = await GroupRoom.addGroupMember(member_email, room_code, theme, group_name);

  if (!data) {
    throw new BadRequestError(`Error in adding new members. Try again later.`);
  }

  res.status(StatusCodes.OK).json(data);
};

const removeMember = async (req, res) => {
  const { member_email } = req.body;
  const { room_code } = req.params;

  const data = await GroupRoom.removeMember(member_email, room_code);

  if (!data) {
    throw new BadRequestError(`Error in removing member. Try again later.`);
  }

  res.status(StatusCodes.OK).json(data);
};

const leaveGroup = async (req, res) => {
  const { id } = req.user;
  const { room_id } = req.body;

  const data = await GroupRoom.leaveGroup(id, room_id);

  if (!data) {
    throw new BadRequestError(`Error in leaving group. Try again later.`);
  }

  res.status(StatusCodes.OK).json(data);
};

const getGroupRoom = async (req, res) => {
  const { id } = req.user;
  const { room_code } = req.params;

  const data = await GroupRoom.getGroupRoom(room_code, id);

  if (!data) {
    throw new BadRequestError(`Error in getting the group. Try again later.`);
  }

  const open = await RoomFunctions.openGroupRoom(id, room_code);

  if (!open) {
    throw new BadRequestError(`Error in opening the group. Try again later.`);
  }

  const seen = await RoomFunctions.seeGroupRoom(id, room_code);

  if (!seen) {
    throw new BadRequestError(`Error in seening the group. Try again later.`);
  }

  res.status(StatusCodes.OK).json(data[0]);
};

const getAllGroupRoom = async (req, res) => {
  const { id } = req.user;

  const data = await GroupRoom.getAllGroupRoom(id);

  if (!data) {
    throw new BadRequestError(`Error in getting all your groups.`);
  }

  res.status(StatusCodes.OK).json(data);
};

const seenRoom = async (req, res) => {
  const { room_id } = req.params;
  const { id } = req.user;

  const data = await RoomFunctions.seeGroupRoom(id, room_id);

  if (!data) {
    throw new BadRequestError(`Error in entering room.`);
  }

  res.status(StatusCodes.OK).json(data);
};

const unseenRoom = async (req, res) => {
  const { room_id } = req.params;
  const { id } = req.user;

  const data = await RoomFunctions.unseeGroupRoom(id, room_id);

  if (!data) {
    throw new BadRequestError(`Error in entering room.`);
  }

  res.status(StatusCodes.OK).json(data);
};

const closeRoom = async (req, res) => {
  const { id } = req.user;
  const { room_code } = req.params;

  const data = await RoomFunctions.closeGroupRoom(id, room_code);

  if (!data) {
    throw new BadRequestError(`Error in closing group room. Try again later.`);
  }

  res.status(StatusCodes.OK).json(data);
};

module.exports = {
  createGroupRoom,
  addGroupMember,
  removeMember,
  leaveGroup,
  getGroupRoom,
  getAllGroupRoom,
  seenRoom,
  unseenRoom,
  closeRoom,
};
