const { StatusCodes } = require("http-status-codes");
const { BadRequestError } = require("../ERRORS");
const User = require("../MODELS/User");
const controllerFns = require("./functions");

const updateUser = async (req, res) => {
  const { id } = req.user;
  const { update_type } = req.body;
  const { name, surname, image, in_comms_name, old_password, new_password } = req.body;

  if (update_type === "all") {
    const user = await User.getUser(id);
    const { password } = user[0];
    const isMatch = await controllerFns.verifyPassword(old_password, password);

    if (!isMatch) {
      throw new BadRequestError(
        `The current old password you entered does not match with the password you use now.`
      );
    }

    const hashedPassword = await controllerFns.hashPassword(new_password);
    const data = await User.updateUser(id, name, surname, hashedPassword, image, in_comms_name);

    if (!data) {
      throw new BadRequestError(`Error in updating user`);
    }

    res.status(StatusCodes.OK).json(data);
    return;
  } else if (update_type === "name") {
    const data = await User.updateUserName(id, name);

    if (!data) {
      throw new BadRequestError(`Error in updating name. Try again later.`);
    }

    res.status(StatusCodes.OK).json(data);
    return;
  } else if (update_type === "surname") {
    const data = await User.updateUserSurname(id, surname);

    if (!data) {
      throw new BadRequestError(`Error in updating surname. Try again later.`);
    }

    res.status(StatusCodes.OK).json(data);
    return;
  } else if (update_type === "image") {
    const data = await User.updateUserImage(id, image);

    if (!data) {
      throw new BadRequestError(`Error in updating image. Try again later.`);
    }

    res.status(StatusCodes.OK).json(data);
    return;
  } else if (update_type === "in_comms_name") {
    const data = await User.updateUserICN(id, in_comms_name);

    if (!data) {
      throw new BadRequestError(`Error in updating ICN. Try again later.`);
    }

    res.status(StatusCodes.OK).json(data);
    return;
  } else if (update_type === "password") {
    const user = await User.getUser(id);
    const { password } = user[0];
    const isMatch = await controllerFns.verifyPassword(old_password, password);

    if (!isMatch) {
      throw new BadRequestError(
        `The current old password you entered does not match with the password you use now.`
      );
    }

    const hashedPassword = await controllerFns.hashPassword(new_password);
    const data = await User.updateUserPassword(id, hashedPassword);

    if (!data) {
      throw new BadRequestError(`Error in updating password. Try again later.`);
    }

    res.status(StatusCodes.OK).json(data);
    return;
  }
  throw new BadRequestError(`This type of update is not applicable.`);
};

const logoutUser = async (req, res) => {
  const { id } = req.user;

  const data = await User.userInactive(id);

  if (!data) {
    throw new BadRequestError(`Error in logging out user.`);
  }

  res.status(StatusCodes.OK).json(data);
};

const getAllUsers = async (req, res) => {
  const { id } = req.user;

  const data = await User.getAllUsers(id);

  if (!data) {
    throw new BadRequestError(`Error in getting all users. Try again later.`);
  }

  res.status(StatusCodes.OK).json(data);
};

const getUser = async (req, res) => {
  const { user_id } = req.params;

  const data = await User.getUser(user_id);

  if (!data) {
    throw new BadRequestError(`Error in getting user. Try again later.`);
  }

  res.status(StatusCodes.OK).json(data[0]);
};

module.exports = { updateUser, logoutUser, getAllUsers, getUser };
