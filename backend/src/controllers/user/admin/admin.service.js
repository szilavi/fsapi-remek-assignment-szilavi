const Product = require("../../../models/product.model");
const Wish = require("../../../models/wish.model");
const User = require("../../../models/user.model");
const mongoose = require("mongoose");

exports.findAll = async () => User.find({ role: 1 });

exports.findById = (id) => User.findById(id);

exports.deleteWishesByUserId = async (userId) => {
  return Wish.deleteMany({ userId });
};

exports.updateListingsBySellerId = async (userId) => {
  return Product.updateMany(
    { sellerId: userId },
    { $set: { status: "failed" } }
  );
};

exports.deleteUserById = async (id) => {
  return User.findByIdAndDelete(id);
};
