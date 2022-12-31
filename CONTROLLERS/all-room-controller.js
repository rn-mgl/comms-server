const { StatusCodes } = require("http-status-codes");
const AllRoom = require("../MODELS/AllRoom");
const { BadRequestError } = require("../ERRORS");

const getAllRooms = async (req, res) => {
  const { id } = req.user;

  const data = await AllRoom.getAllRooms(id);

  if (!data) {
    throw new BadRequestError(`Error in getting all rooms. Try again later.`);
  }

  res.status(StatusCodes.OK).json(data);
};

module.exports = { getAllRooms };
