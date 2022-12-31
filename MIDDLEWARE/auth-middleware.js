const { UnauthenticatedError } = require("../ERRORS");
const jwt = require("jsonwebtoken");

const authenticationMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new UnauthenticatedError(`Unauthorized user`);
  }

  const token = authHeader.split(" ")[1];

  const decode = jwt.decode(token, process.env.JWT_SECRET);

  req.user = {
    id: decode.id,
    name: decode.name,
    surname: decode.surname,
    email: decode.email,
  };

  next();
};

module.exports = authenticationMiddleware;
