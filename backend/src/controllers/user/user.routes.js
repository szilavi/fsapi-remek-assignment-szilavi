const authenticateJWT = require("../../auth/authenticate");
const adminAuth = require("../../auth/adminOnly");

const express = require("express");

const router = express.Router();

const userController = require("./user.controller");

router.use(
  "/admin",
  authenticateJWT,
  adminAuth,
  require("./admin/admin.routes")
);

router.get("/:id", authenticateJWT, (req, res, next) => {
  return userController.findById(req, res, next);
});

router.post("/", (req, res, next) => {
  return userController.create(req, res, next);
});

router.put("/:id", authenticateJWT, (req, res, next) => {
  return userController.update(req, res, next);
});

router.post("/forgot-password", (req, res, next) => {
  return userController.forgotPass(req, res, next);
});

module.exports = router;
