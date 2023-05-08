const Product = require("../../models/product.model");
const mongoose = require("mongoose");
const User = require("../../models/user.model");
const Game = require("../../models/game.model");

exports.findAll = async () => {
  // Lekérdezzük a megfelelő felhasználókat (szerepkör szerint)
  const usersWithRole = await mongoose
    .model("user")
    .find({ role: 3 }, "_id")
    .lean();
  const userIds = usersWithRole.map((user) => user._id);

  // Lekérdezzük a termékeket a korábban lekérdezett felhasználók alapján
  const products = await Product.find({
    sellerId: { $in: userIds },
    status: { $ne: "failed" },
    status: { $ne: "deal" },
  })
    .select("_id gameId sellerId price")
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

exports.create = async (productData) => {
  let gameId = productData.gameId;

  if (gameId === "") {
    const newGame = new Game({
      title: productData.title,
    });
    await newGame.save();
    gameId = newGame._id.toString();
  }

  const newProduct = new Product({ ...productData, gameId });
  const savedProduct = await newProduct.save();

  console.log("Product saved: ", savedProduct);
  return savedProduct;
};

exports.findById = async (id) => {
  try {
    const product = await Product.findById(id);
    const gameId = product.gameId;
    const sellerId = product.sellerId;

    const { ...game } = await Game.findById(gameId).select("-_id").lean();
    const { ...seller } = await User.findById(sellerId)
      .select("-role -password -_id -createdAt -updatedAt -__v -address._id")
      .lean();

    const { _id, price, condition } = product;
    return { ...game, ...seller, _id, price, condition };
  } catch (error) {
    throw new Error("Product not found");
  }
};

exports.findGameByTitle = async (title) => {
  const regex = new RegExp(title, "i");
  const games = await Game.find({ title: regex });
  return games;
};

exports.findProductsByUserId = async (userId) => {
  const products = await Product.find({ sellerId: userId, status: "offer" })
    .select("_id gameId status price")
    .populate("gameId", "title")
    .lean();

  console.log("SERVICE", products);

  return products.map((product) => ({
    status: product.status,
    _id: product._id,
    gameTitle: product.gameId.title,
    price: product.price,
  }));
};

exports.findProductAndUpdate = async (offerId) => {
  await Product.updateOne({ _id: offerId }, { status: "deal" });
};

exports.findAndDelete = async (offerId) => {
  await Product.updateOne({ _id: offerId }, { status: "failed" });
};
