const { StatusCodes } = require("http-status-codes");
const { BadRequestError } = require("../ERRORS");
const GroupRequest = require("../MODELS/GroupRequest");
const RequestFunctions = require("../MODELS/FUNCTIONS/RequestFunctions");
const GroupRoom = require("../MODELS/GroupRoom");
const RoomFunctions = require("../MODELS/FUNCTIONS/RoomFunctions");

const createRequest = async (req, res) => {
  const { id } = req.user;
  const { request_to, room_code, group_name } = req.body;

  const newRequest = new GroupRequest(id, request_to, room_code, group_name);

  const data = await newRequest.createRequest();

  if (!data) {
    throw new BadRequestError(`Error in sending join request. Try again later.`);
  }

  res.status(StatusCodes.OK).json(data);
};

const getAllRequest = async (req, res) => {
  const { id } = req.user;
  const { request_type } = req.query;

  if (request_type === "sent") {
    const data = await GroupRequest.getAllSentRequest(id);

    if (!data) {
      throw new BadRequestError(`Error in getting sent requests.`);
    }

    res.status(StatusCodes.OK).json(data);
    return;
  } else if (request_type === "received") {
    const data = await GroupRequest.getAllReceivedRequest(id);

    if (!data) {
      throw new BadRequestError(`Error in getting received requests.`);
    }

    const seeRequests = await RequestFunctions.seeDirectRequests(id);

    if (!seeRequests) {
      throw new BadRequestError(`Error in viewing requests.`);
    }

    res.status(StatusCodes.OK).json(data);
    return;
  } else {
    throw new BadRequestError(`This type of request is not applicable.`);
  }
};

const cancelRequest = async (req, res) => {
  const { id } = req.user;
  const { request_id } = req.params;

  const data = await GroupRequest.cancelRequest(id, request_id);

  if (!data) {
    throw new BadRequestError(`Error in sending request. Try again later.`);
  }

  res.status(StatusCodes.OK).json(data);
};

const acceptRequest = async (req, res) => {
  const { id } = req.user;
  const { request_by, request_id, room_code } = req.body;

  const data = await GroupRequest.acceptRequest(id, request_by, request_id, room_code);

  if (!data) {
    throw new BadRequestError(`Error in accepting request. Try again later.`);
  }

  const check = await GroupRoom.checkIfMember(request_by, room_code);

  if (check[0].member_already) {
    const reAdd = await GroupRoom.reAddMember(request_by, room_code);

    if (!reAdd) {
      throw new BadRequestError(`Error in adding member.`);
    }

    res.status(StatusCodes.OK).json(data);
    return;
  }

  const acceptMember = await GroupRoom.acceptGroupMember(request_by, room_code);

  if (!acceptMember) {
    throw new BadRequestError(`Error in accepting request. Try again later.`);
  }

  const updateRoom = await RoomFunctions.updateGroupRoomDate(room_code);

  if (!updateRoom) {
    throw new BadRequestError(`Error in updating room.`);
  }

  res.status(StatusCodes.OK).json(data);
};

const rejectRequest = async (req, res) => {
  const { id } = req.user;

  const { request_by, request_id } = req.body;

  const data = await GroupRequest.rejectRequest(id, request_by, request_id);

  if (!data) {
    throw new BadRequestError(`Error in rejecting request. Try again later.`);
  }

  res.status(StatusCodes.OK).json(data);
};

module.exports = { createRequest, getAllRequest, cancelRequest, acceptRequest, rejectRequest };
