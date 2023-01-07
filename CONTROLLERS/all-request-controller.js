const { StatusCodes, BAD_GATEWAY } = require("http-status-codes");
const { BadRequestError } = require("../ERRORS");
const RequestFunctions = require("../MODELS/FUNCTIONS/RequestFunctions");

const getCountAllUnseenReceivedRequests = async (req, res) => {
  const { id } = req.user;

  const data = await RequestFunctions.getCountAllUnseenReceivedRequests(id);

  if (!data) {
    throw new BadRequestError(`Error in getting count of received requests.`);
  }

  res.status(StatusCodes.OK).json(data[0]);
};

module.exports = { getCountAllUnseenReceivedRequests };
