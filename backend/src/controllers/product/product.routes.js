const authenticateJWT = require("../../auth/authenticate");
const adminAuth = require("../../auth/adminOnly");

const express = require("express");

const router = express.Router();

const productController = require("./product.controller");

router.use(
  "/admin",
  authenticateJWT,
  adminAuth,
  require("./admin/admin.routes")
);

router.get("/", authenticateJWT, (req, res, next) => {
  return productController.findAll(req, res, next);
});

router.get("/:id", authenticateJWT, (req, res, next) => {
  return productController.findById(req, res, next);
});

router.post("/", authenticateJWT, (req, res, next) => {
  return productController.create(req, res, next);
});

router.get("/game/search", authenticateJWT, (req, res, next) => {
  const title = req.query.title;
  return productController.findGameByTitle(title, res, next);
});

router.get("/user/offers/:userId", authenticateJWT, (req, res, next) => {
  return productController.findProductsByUserId(req, res, next);
});

router.put("/:id", authenticateJWT, (req, res, next) => {
  return productController.findProductAndUpdate(req, res, next);
});

router.delete("/:id", authenticateJWT, (req, res, next) => {
  return productController.findProductAndDelete(req, res, next);
});

module.exports = router;
