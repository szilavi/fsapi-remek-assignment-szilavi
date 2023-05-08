const mongoose = require("mongoose");
const Wish = require("../../../models/wish.model");
const User = require("../../../models/user.model");
const Game = require("../../../models/game.model");

exports.findAll = async () => {
  const wishes = await Wish.find()
    .populate("userId", "name")
    .populate("gameId", "title")
    .exec();
  return wishes.map((wish) => ({
    _id: wish._id,
    userId: [wish.userId.name],
    gameId: [wish.gameId.title],
  }));
};
