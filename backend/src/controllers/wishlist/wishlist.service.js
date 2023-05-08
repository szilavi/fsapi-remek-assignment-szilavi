const mongoose = require("mongoose");
const Wish = require("../../models/wish.model");
const Product = require("../../models/product.model");
const User = require("../../models/user.model");
const Game = require("../../models/game.model");

exports.findById = async (id) => {
  const wish = await Wish.find({ userId: id })
    .select("_id gameId")
    .populate("gameId", "title")
    .lean();

  return wish.map((wishItem) => ({
    _id: wishItem._id,
    gameTitle: wishItem.gameId.title,
  }));
};

exports.create = async (wishData) => {
  let gameId = wishData.gameId;

  if (!gameId) {
    const newGame = new Game({
      title: wishData.title,
    });
    await newGame.save();
    gameId = newGame._id.toString();
  }

  const newWish = new Wish({ ...wishData, gameId });
  const savedWish = await newWish.save();
  return savedWish;
};

exports.findAndDelete = async (wishId) => {
  const deletedWish = await Wish.findByIdAndDelete(wishId);
  return deletedWish;
};
