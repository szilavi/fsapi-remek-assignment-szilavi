const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
const RefreshToken = require("../models/refreshToken.model");
const createError = require("http-errors");
const bcrypt = require("bcrypt");

exports.login = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new createError.BadRequest("Missing email or password"));
  }

  const user = await User.findOne({ email });

  if (!user) {
    return next(new createError.NotFound("Incorrect email or password"));
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    return next(new createError.Unauthorized("Incorrect email or password"));
  }

  const accessToken = jwt.sign(
    {
      name: user.name,
      email: user.email,
      role: user.role,
      _id: user._id,
    },
    process.env.ACCESS_TOKEN_SECRET_KEY,
    {
      expiresIn: process.env.ACCES_TOKEN_EXPIRY,
    }
  );

  const refreshToken = jwt.sign(
    {
      name: user.name,
      email: user.email,
      role: user.role,
      _id: user._id,
    },
    process.env.REFRESH_TOKEN_SECRET_KEY
  );

  await new RefreshToken({ token: refreshToken, userId: user._id }).save();

  res.json({
    accessToken,
    refreshToken,
    user: {
      name: user.name,
      _id: user._id,
      email: user.email,
      role: user.role,
    },
  });
};

exports.refresh = async (req, res, next) => {
  const refreshToken = req.body.refreshToken;

  if (!refreshToken) {
    return next(new createError.Forbidden("Forbidden"));
  }

  const foundToken = await RefreshToken.findOne({ token: refreshToken });

  if (foundToken) {
    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET_KEY,
      (err, payload) => {
        if (err) {
          return next(new createError.Forbidden("Forbidden"));
        }

        const accessToken = jwt.sign(
          {
            email: payload.email,
            role: payload.role,
            _id: payload._id,
            name: payload.name,
          },
          process.env.ACCESS_TOKEN_SECRET_KEY,
          {
            expiresIn: process.env.ACCES_TOKEN_EXPIRY,
          }
        );
        res.json({ accessToken });
      }
    );
  } else {
    return next(new createError.Forbidden("Forbidden"));
  }
};

exports.logout = async (req, res, next) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return next(new createError.BadRequest("Bad Request"));
  }

  const deletedToken = await RefreshToken.findOneAndRemove({
    token: refreshToken,
  });

  if (deletedToken) {
    res.status(200).json({ message: "OK" });
  } else {
    return next(new createError.Unauthorized("Unauthorized"));
  }
};

exports.me = (req, res, next) => {
  const authorization = req.headers.authorization;
  const token = authorization.split(" ")[1];

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET_KEY, (err, user) => {
    if (err) {
      return next(new createError.Unauthorized({ message: "Unauthorized" }));
    }

    res.json({ user });
  });
};
