const productService = require("./product.service");

// MODELS
const User = require("../../models/user.model");
const Game = require("../../models/game.model");

// GET ALL PRODUCTS

exports.findAll = async (req, res, next) => {
  try {
    const products = await productService.findAll();
    res.json(products);
  } catch (error) {
    next(error);
  }
};

// GET A PRODUCT

exports.findById = async (req, res, next) => {
  const productId = req.params.id;
  try {
    const product = await productService.findById(productId);
    res.json(product);
  } catch (error) {
    next(error);
  }
};

// CREATE A PRODUCT

exports.create = async (req, res, next) => {
  try {
    const productData = req.body;
    await productService.create(productData);
    res.status(201).json({ message: "You made an offer!" });
  } catch (error) {
    return next(error);
  }
};

// FIND GAME

exports.findGameByTitle = async (title, res, next) => {
  try {
    const games = await productService.findGameByTitle(title);
    res.status(200).json(games);
  } catch (error) {
    next(error);
  }
};

// FIND USER OFFERS

exports.findProductsByUserId = async (req, res, next) => {
  const userId = req.params.userId;
  try {
    const products = await productService.findProductsByUserId(userId);
    res.status(200).json(products);
  } catch (error) {
    next(error);
  }
};

// FIND AND BUY OFFER

exports.findProductAndUpdate = async (req, res, next) => {
  const offerId = req.params.id;

  try {
    await productService.findProductAndUpdate(offerId);
    res.status(200).json({ message: "DEAL!" });
  } catch (error) {
    next(error);
  }
};

// FIND AND DELETE OFFER

exports.findProductAndDelete = async (req, res, next) => {
  const offerId = req.params.id;

  try {
    await productService.findAndDelete(offerId);
    res.status(200).json({ message: "Delete successful" });
  } catch (error) {
    next(error);
  }
};
