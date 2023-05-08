const express = require("express");

const router = express.Router();

const adminController = require("./admin.controller");

router.get("/", (req, res, next) => {
  return adminController.findAll(req, res, next);
});

router.get("/:id", (req, res, next) => {
  return adminController.findById(req, res, next);
});

module.exports = router;
