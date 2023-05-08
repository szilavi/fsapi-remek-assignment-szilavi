const jwt = require("jsonwebtoken");
const createError = require("http-errors");

module.exports = (req, res, next) => {
  const user = req.user;

  if (!user || user.role < 3) {
    return next(new createError.Forbidden("Forbidden"));
  }

  next();
};
