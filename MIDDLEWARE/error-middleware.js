const { StatusCodes } = require("http-status-codes");

const errorHandlerMiddleware = (err, req, res, next) => {
  console.log(err);

  let customError = {
    statusCode: err.StatusCodes || StatusCodes.INTERNAL_SERVER_ERROR,
    msg: err.message || "Something went wrong.",
  };

  if (err.errno === 1062) {
    customError.statusCode = StatusCodes.BAD_REQUEST;
    customError.msg = `Input for ${err.sqlMessage.split(" ")[2]} already exists.`;
  }

  res.status(customError.statusCode).json({ msg: customError.msg });
};

module.exports = errorHandlerMiddleware;
