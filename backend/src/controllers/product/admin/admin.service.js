const Product = require("../../../models/product.model");
const mongoose = require("mongoose");
const User = require("../../../models/user.model");
const Game = require("../../../models/game.model");

exports.findAll = async () => {
  // Lekérdezzük a megfelelő felhasználókat (szerepkör szerint)
  const usersWithRole = await mongoose
    .model("user")
    .find({ role: 1 }, "_id")
    .lean();
  const userIds = usersWithRole.map((user) => user._id);

  // Lekérdezzük a termékeket a korábban lekérdezett felhasználók alapján
  const products = await Product.find({
    sellerId: { $in: userIds },
    status: "offer",
  })
    .select("_id gameId sellerId status price description added")
    .lean();

  // Lekérdezzük a játékokat és felhasználókat
  const games = await Game.find({}, "_id title").lean();
  const users = await User.find({ _id: { $in: userIds } }, "_id name").lean();

  // Összekapcsoljuk a termékeket a játékokkal és felhasználókkal
  return products.map((product) => {
    const game = games.find((game) => game._id.equals(product.gameId));
    const user = users.find((user) => user._id.equals(product.sellerId));

    return {
      ...product,
      gameId: game ? [game.title] : [],
      sellerId: user ? [user.name] : [],
    };
  });
};

exports.findById = async (id) => {
  const product = await Product.findById(id);

  if (!product) {
    return null;
  }

  const gameId = product.gameId;
  const sellerId = product.sellerId;

  const { price, added, condition } = product;

  const game = await Game.findById(gameId).lean();
  const seller = await User.findById(sellerId).lean();

  return { ...game, ...seller, price, added, condition };
};
