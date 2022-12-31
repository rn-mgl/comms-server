const { StatusCodes } = require("http-status-codes");
const { BadRequestError } = require("../ERRORS");
const User = require("../MODELS/User");
const controllerFns = require("./functions");

const updateUser = async (req, res) => {
  const { id } = req.user;
  const { name, surname, old_password, new_password, in_comms_name } = req.body;

  const user = await User.getUser(id);

  const { password } = user[0];

  const isMatch = await controllerFns.verifyPassword(old_password, password);

  if (!isMatch) {
    throw new BadRequestError(
      `The current password you entered does not match with the password you use now.`
    );
  }

  const hashedPassword = await controllerFns.hashPassword(new_password);

  const data = await User.updateUser(id, name, surname, hashedPassword, in_comms_name);

  if (!data) {
    throw new BadRequestError(`Error in updating user`);
  }

  res.status(StatusCodes.OK).json(data);
};

const logoutUser = async (req, res) => {
  const { id } = req.user;

  const data = await User.userInactive(id);

  if (!data) {
    throw new BadRequestError(`Error in logging out user.`);
  }

  res.status(StatusCodes.OK).json(data);
};

module.exports = { updateUser, logoutUser };
