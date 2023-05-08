const authenticateJWT = require("../../auth/authenticate");
const adminAuth = require("../../auth/adminOnly");

const express = require("express");

const router = express.Router();

const wishlistController = require("./wishlist.controller");

router.use(
  "/admin",
  authenticateJWT,
  adminAuth,
  require("./admin/admin.routes")
);

router.get("/:userId", authenticateJWT, (req, res, next) => {
  return wishlistController.findById(req, res, next);
});

router.post("/", authenticateJWT, (req, res, next) => {
  return wishlistController.create(req, res, next);
});

router.delete("/:id", authenticateJWT, (req, res, next) => {
  return wishlistController.findWishAndDelete(req, res, next);
});

module.exports = router;
