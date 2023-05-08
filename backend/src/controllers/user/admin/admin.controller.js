const adminService = require("./admin.service");

// MODELS
const User = require("../../../models/user.model");
const Game = require("../../../models/game.model");

// GET ALL PRODUCTS

exports.findAll = async (req, res, next) => {
  try {
    const users = await adminService.findAll();
    res.json(users);
  } catch (error) {
    return next(error);
  }
};

// GET A PRODUCT

exports.findById = async (req, res, next) => {
  const userId = req.params.id;
  try {
    const user = await adminService.findById(userId);

    res.json(user);
  } catch (error) {
    next(error);
  }
};

// DELETE USER

exports.deleteById = async (req, res, next) => {
  const userId = req.params.id;

  try {
    await adminService.deleteWishesByUserId(userId);

    await adminService.updateListingsBySellerId(userId);

    await adminService.deleteUserById(userId);

    res.status(201).json({ message: "User deleted!" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "An error occurred while deleting the user." });
  }
};
