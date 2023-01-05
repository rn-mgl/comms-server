const { StatusCodes } = require("http-status-codes");
const { BadRequestError } = require("../ERRORS");
const DirectRequest = require("../MODELS/DirectRequest");
const DirectRoom = require("../MODELS/DirectRoom");
const crypto = require("crypto");

const createRequest = async (req, res) => {
  const { id } = req.user;
  const { request_to } = req.body;

  const newRequest = new DirectRequest(id, request_to);

  const data = await newRequest.createRequest();

  if (!data) {
    throw new BadRequestError(`Error in sending request. Try again later.`);
  }

  res.status(StatusCodes.OK).json(data);
};

const cancelRequest = async (req, res) => {
  const { id } = req.user;
  const { request_id } = req.params;

  const data = await DirectRequest.cancelRequest(id, request_id);

  if (!data) {
    throw new BadRequestError(`Error in sending request. Try again later.`);
  }

  res.status(StatusCodes.OK).json(data);
};

const acceptRequest = async (req, res) => {
  const { id } = req.user;
  const { request_id, request_by } = req.body;

  const roomCode = crypto.randomBytes(50).toString("hex");

  const data = await DirectRequest.acceptRequest(id, request_by, request_id);

  if (!data) {
    throw new BadRequestError(`Error in accepting request. Try again later.`);
  }

  const add = await DirectRoom.addUserById(request_by, id, roomCode);

  if (!add) {
    throw new BadRequestError(`Error in creating room.`);
  }

  res.status(StatusCodes.OK).json(data);
};

const rejectRequest = async (req, res) => {
  const { id } = req.user;

  const { request_by, request_id } = req.body;

  const data = await DirectRequest.rejectRequest(id, request_by, request_id);

  if (!data) {
    throw new BadRequestError(`Error in rejecting request. Try again later.`);
  }

  res.status(StatusCodes.OK).json(data);
};

const getAllRequest = async (req, res) => {
  const { request_type } = req.query;
  const { id } = req.user;

  if (request_type === "sent") {
    const data = await DirectRequest.getAllSentRequest(id);

    if (!data) {
      throw new BadRequestError(`Error in getting all sent requests.`);
    }

    res.status(StatusCodes.OK).json(data);
    return;
  } else if (request_type === "received") {
    const data = await DirectRequest.getAllReceivedRequest(id);

    if (!data) {
      throw new BadRequestError(`Error in getting all received requests.`);
    }

    res.status(StatusCodes.OK).json(data);
    return;
  } else {
    throw new BadRequestError(`Request type is not applicable.`);
  }
};

module.exports = { createRequest, cancelRequest, acceptRequest, rejectRequest, getAllRequest };
