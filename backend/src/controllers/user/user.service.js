const mongoose = require("mongoose");
const User = require("../../models/user.model");

exports.findById = (id) =>
  User.findById(id).select("-password -role -__v -updatedAt -createdAt");

exports.create = (user) => {
  const newUser = new User(user);
  return newUser.save();
};

exports.update = (id, userData) =>
  User.findByIdAndUpdate(id, userData, { new: true });

exports.getUserById = async (userId) => {
  const user = await User.findById(userId);
  return user;
};
