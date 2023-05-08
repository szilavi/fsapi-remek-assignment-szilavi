const wishlistService = require("./wishlist.service");
// const createError = require("http-errors");
// const wishlistError = require("./wish-error-handler/wish.errors");

// GET WISHES

exports.findById = async (req, res, next) => {
  const userId = req.params.userId;
  try {
    const products = await wishlistService.findById(userId);
    if (products.length > 0) {
      res.status(200).json(products);
    } else {
      res
        .status(404)
        .json({ message: "No wishlist items found for this user." });
    }
  } catch (error) {
    next(error);
  }
};

// CREATE A WISH

exports.create = async (req, res, next) => {
  try {
    const wishData = req.body;
    await wishlistService.create(wishData);
    res.status(201).json({ message: "Added to your wislist!" });
  } catch (error) {
    return next(error);
  }
};

// DELETE A WISH

exports.findWishAndDelete = async (req, res, next) => {
  const wishId = req.params.id;

  try {
    const deletedWish = await wishlistService.findAndDelete(wishId);
    if (deletedWish) {
      res.status(200).json({ message: "Delete successful" });
    } else {
      res.status(404).json({ message: "Wish not found" });
    }
  } catch (error) {
    next(error);
  }
};
