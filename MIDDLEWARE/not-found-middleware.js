const notFoundMiddleware = (err, req, res, next) => {
  res.status(404).json({ msg: "This page is not ours." });
};

module.exports = notFoundMiddleware;
