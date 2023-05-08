const userService = require("./user.service");
const User = require("../../models/user.model");
const createError = require("http-errors");
const userError = require("./user-error-handler/user.errors");
const bcrypt = require("bcrypt");
const saltRounds = 10;

// GET A USER

exports.findById = async (req, res, next) => {
  const userId = req.params.id;
  const errorMessage = userError.validateUserId(userId);
  const loggedInUserId = req.user._id;
  const loggedInAdmin = req.user.role;

  if (userId !== loggedInUserId && loggedInAdmin !== 3) {
    return next(
      new createError.Forbidden("You can only view your own profile.")
    );
  }

  if (errorMessage) {
    return next(new createError.BadRequest(errorMessage));
  }

  try {
    const user = await userService.findById(userId);
    const missingUser = userError.userNotFound(user);
    if (missingUser) {
      return next(new createError.NotFound(missingUser));
    }
    res.json(user);
  } catch (error) {
    return next(error);
  }
};

// CREATE A USER

exports.create = async (req, res, next) => {
  const errorMessage = userError.userSaving(req.body);

  if (errorMessage) {
    return next(new createError.BadRequest(errorMessage));
  }

  try {
    const email = req.body.email;
    const emailError = await userError.isEmailRegistered(email);

    if (emailError) {
      return next(new createError.BadRequest(emailError));
    } else {
      const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);
      req.body.password = hashedPassword;
      await userService.create(req.body);
      res.status(201).json({ message: "Registration successful!" });
    }
  } catch (error) {
    return next(error);
  }
};

// UPDATE A USER

exports.update = async (req, res, next) => {
  const userId = req.params.id;

  try {
    const currentUser = await userService.getUserById(userId);

    if (!currentUser) {
      return next(new createError.NotFound("User not found"));
    }

    const isPasswordValid = await bcrypt.compare(
      req.body.password,
      currentUser.password
    );

    if (!isPasswordValid) {
      return next(new createError.BadRequest("Invalid password"));
    }

    if (req.body.newPassword) {
      const hashedNewPassword = await bcrypt.hash(
        req.body.newPassword,
        saltRounds
      );
      req.body.password = hashedNewPassword;
    } else {
      req.body.password = currentUser.password;
    }

    delete req.body.newPassword;

    const user = await userService.update(userId, req.body);
    res.status(200).json("Changes saved");
  } catch (error) {
    return next(error);
  }
};

// FORGOT PASSWORD

exports.forgotPass = async (req, res, next) => {
  try {
    const email = req.body.email;
    res.status(200).json({ message: "We sent your new password!" });
  } catch (error) {
    return next(error);
  }
};
