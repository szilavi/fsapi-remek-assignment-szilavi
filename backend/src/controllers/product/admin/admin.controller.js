const adminService = require("./admin.service");

// MODELS
const User = require("../../../models/user.model");
const Game = require("../../../models/game.model");

// GET ALL PRODUCTS

exports.findAll = async (req, res, next) => {
  try {
    const products = await adminService.findAll();
    res.json(products);
  } catch (error) {
    next(error);
  }
};

exports.findById = async (req, res, next) => {
  const productId = req.params.id;
  try {
    const product = await adminService.findById(productId);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(product);
  } catch (error) {
    next(error);
  }
};
