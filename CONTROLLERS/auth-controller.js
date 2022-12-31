const { StatusCodes } = require("http-status-codes");
const { BadRequestError } = require("../ERRORS");
const User = require("../MODELS/User");
const isEmail = require("validator/lib/isEmail");
const controllerFns = require("./functions");
const jwt = require("jsonwebtoken");

const signUpUser = async (req, res) => {
  const { name, surname, email, password, in_comms_name } = req.body;

  const findEmail = await User.findByEmail(email);

  if (findEmail.length > 0) {
    throw new BadRequestError(`Your email ${email} already exists.`);
  }

  if (!isEmail(email)) {
    throw new BadRequestError(`Your email ${email} is not valid.`);
  }

  const hashed_password = await controllerFns.hashPassword(password);
  const user = new User(name, surname, email, hashed_password, in_comms_name);
  const data = await user.createUser();

  if (!data) {
    throw new BadRequestError(`Error in signing up.`);
  }

  const user_id = data.insertId;
  const token = controllerFns.createToken(user_id, name, surname, email);

  res.status(StatusCodes.OK).json({ token, user: { id: user_id } });

  const info = await controllerFns.sendEmail(token, name, surname, email);

  return;
};

const loginUser = async (req, res) => {
  const { candidate_email, candidate_password } = req.body;

  const findEmail = await User.findByEmail(candidate_email);

  if (findEmail.length < 1) {
    throw new BadRequestError(`The email ${candidate_email} does not exist in our site.`);
  }

  const { user_id, name, surname, email, password, is_confirmed } = findEmail[0];

  const isMatch = await controllerFns.verifyPassword(candidate_password, password);

  if (!isMatch) {
    throw new BadRequestError(`The email and password you entered does not match.`);
  }

  if (!is_confirmed) {
    throw new BadRequestError(`Your email is not a confirmed account in our site.`);
  }

  const token = controllerFns.createToken(user_id, name, surname, email);

  const active = await User.userActive(user_id);

  res.status(StatusCodes.OK).json({
    msg: "signed in successfully",
    token,
    user: {
      id: user_id,
      name,
      surname,
      email,
    },
  });

  return;
};

const confirmUser = async (req, res) => {
  const { token } = req.params;

  if (!token) {
    throw new BadRequestError(`Your token is tampered. Try signing up again.`);
  }

  const decode = jwt.decode(token, process.env.JWT_SECRET);

  const { id } = decode;

  const data = await User.confirmUser(id);

  if (!data) {
    throw new BadRequestError(`Error in confirming your account. Try again later.`);
  }

  res.status(StatusCodes.OK).json({ msg: `You are now a confirmed user of comms-by-rltn.` });
};

module.exports = { signUpUser, loginUser, confirmUser };
