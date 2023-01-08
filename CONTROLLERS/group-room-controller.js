const { StatusCodes } = require("http-status-codes");
const { BadRequestError } = require("../ERRORS");
const GroupRoom = require("../MODELS/GroupRoom");
const crypto = require("crypto");
const RoomFunctions = require("../MODELS/FUNCTIONS/RoomFunctions");
const GroupRequest = require("../MODELS/GroupRequest");
const GroupMessage = require("../MODELS/GroupMessage");

const createGroupRoom = async (req, res) => {
  const { group_name, is_public } = req.body;
  const { id } = req.user;

  const roomCode = crypto.randomBytes(50).toString("hex");

  const group = new GroupRoom(roomCode, id, group_name, is_public);

  const data = await group.createGroupRoom();

  if (!data) {
    throw new BadRequestError(`Error in making group. Try again later.`);
  }

  res.status(StatusCodes.OK).json(data);
};

const addGroupMember = async (req, res) => {
  const { member_id, theme, group_name } = req.body;
  const { room_code } = req.params;

  const memberCheck = await GroupRoom.checkIfMember(member_id, room_code);

  if (memberCheck[0].member_already) {
    const reAddData = await GroupRoom.reAddMember(member_id, room_code);

    if (!reAddData.affectedRows) {
      throw new BadRequestError(`This user decided to not be involved in this group any longer.`);
    }

    const updateRoom = await RoomFunctions.updateGroupRoomDate(room_code);

    if (!updateRoom) {
      throw new BadRequestError(`Error in updating room.`);
    }

    res.status(StatusCodes.OK).json(reAddData);
    return;
  }

  const data = await GroupRoom.addGroupMember(member_id, room_code, theme, group_name);

  if (!data) {
    throw new BadRequestError(`Error in adding new members. Try again later.`);
  }

  const updateRoom = await RoomFunctions.updateGroupRoomDate(room_code);

  if (!updateRoom) {
    throw new BadRequestError(`Error in updating room.`);
  }

  res.status(StatusCodes.OK).json(data);
};

const removeMember = async (req, res) => {
  const { member_id } = req.body;
  const { room_code } = req.params;

  const data = await GroupRoom.removeMember(member_id, room_code);

  if (!data) {
    throw new BadRequestError(`Error in removing member. Try again later.`);
  }

  const removeRequest = await GroupRequest.deleteRequest(member_id, room_code);

  if (!removeRequest) {
    throw new BadRequestError(`Error in removing request. Try again later.`);
  }

  const updateRoom = await RoomFunctions.updateGroupRoomDate(room_code);

  if (!updateRoom) {
    throw new BadRequestError(`Error in updating room.`);
  }

  res.status(StatusCodes.OK).json(data);
};

const leaveGroup = async (req, res) => {
  const { id } = req.user;
  const { room_code } = req.body;

  const data = await GroupRoom.leaveGroup(id, room_code);

  if (!data) {
    throw new BadRequestError(`Error in leaving group. Try again later.`);
  }

  const removeRequest = await GroupRequest.deleteRequest(id, room_code);

  if (!removeRequest) {
    throw new BadRequestError(`Error in leaving group. Try again later.`);
  }

  const count = await RoomFunctions.checkIfGroupEmpty(room_code);

  if (count[0].member_count === 0) {
    const deleteGroup = await GroupRoom.deleteGroup(room_code);

    if (!deleteGroup) {
      throw new BadRequestError(`Error in deleting group. Try again later.`);
    }

    const deleteRequests = await GroupRequest.deleteRoomRequest(room_code);

    if (!deleteRequests) {
      throw new BadRequestError(`Error in deleting requests. Try again later.`);
    }
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
  const { group_type } = req.query;

  if (group_type === "all") {
    const data = await GroupRoom.getAllGroupRoom(id);
    if (!data) {
      throw new BadRequestError(`Error in getting all your groups.`);
    }
    res.status(StatusCodes.OK).json(data);
    return;
  } else if (group_type === "public") {
    const data = await GroupRoom.getAllPublicGroupRoom(id);
    if (!data) {
      throw new BadRequestError(`Error in getting all public rooms. Try again later.`);
    }
    res.status(StatusCodes.OK).json(data);
    return;
  } else if (group_type === "private") {
    const data = await GroupRoom.getAllPrivateGroupRoom(id);
    if (!data) {
      throw new BadRequestError(`Error in getting all public rooms. Try again later.`);
    }
    res.status(StatusCodes.OK).json(data);
    return;
  } else {
    throw new BadRequestError(`This type of public group type is not applicable.`);
  }
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

const closeRoom = async (req, res) => {
  const { id } = req.user;
  const { room_code } = req.params;

  const data = await RoomFunctions.closeGroupRoom(id, room_code);

  if (!data) {
    throw new BadRequestError(`Error in closing group room. Try again later.`);
  }

  res.status(StatusCodes.OK).json(data);
};

const muteRoom = async (req, res) => {
  const { id } = req.user;
  const { room_code } = req.body;

  const data = await RoomFunctions.muteGroupRoom(id, room_code);

  if (!data) {
    throw new BadRequestError(`Error in muting room. Try again later.`);
  }

  res.status(StatusCodes.OK).json(data);
};

const blockRoom = async (req, res) => {
  const { id } = req.user;
  const { room_code } = req.body;

  const data = await RoomFunctions.blockGroupRoom(id, room_code);

  if (!data) {
    throw new BadRequestError(`Error in blocking room. Try again later.`);
  }

  const leaveGroup = await GroupRoom.leaveGroup(id, room_code);

  if (!leaveGroup) {
    throw new BadRequestError(`Error in leaving room. Try again later.`);
  }

  res.status(StatusCodes.OK).json(data);
};

const joinRoom = async (req, res) => {
  const { id } = req.user;
  const { room_code } = req.params;

  const check = await GroupRoom.checkIfMember(id, room_code);

  if (check[0].member_already) {
    const reAddData = await GroupRoom.reAddMember(id, room_code);

    if (!reAddData) {
      throw new BadRequestError(`Error in re-joining room. Try again later.`);
    }

    const updateRoom = await RoomFunctions.updateGroupRoomDate(room_code);

    if (!updateRoom) {
      throw new BadRequestError(`Error in updating room.`);
    }

    res.status(StatusCodes.OK).json(reAddData);
    return;
  }

  const data = await GroupRoom.joinRoom(id, room_code);

  if (!data) {
    throw new BadRequestError(`Error in joining room. Try again later.`);
  }

  res.status(StatusCodes.OK).json(data);
};

const getAllMembers = async (req, res) => {
  const { room_code } = req.params;

  const data = await GroupRoom.getAllMembers(room_code);

  if (!data) {
    throw new BadRequestError(`Error in getting members. Try again later.`);
  }

  res.status(StatusCodes.OK).json(data);
};

const deleteGroup = async (req, res) => {
  const { room_code } = req.params;

  const data = await GroupRoom.deleteGroup(room_code);

  if (!data) {
    throw new BadRequestError(`Error in deleting room.`);
  }

  const messages = await GroupMessage.deleteGroupMessage(room_code);

  if (!messages) {
    throw new BadRequestError(`Error in deleting messages.`);
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
  closeRoom,
  muteRoom,
  blockRoom,
  joinRoom,
  getAllMembers,
  deleteGroup,
};
