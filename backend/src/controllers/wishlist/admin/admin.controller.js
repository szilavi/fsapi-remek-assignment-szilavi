const adminService = require("./admin.service");

// GET ALL WISH

exports.findAll = async (req, res, next) => {
  try {
    const wishList = await adminService.findAll();
    res.json(wishList);
  } catch (error) {
    return next(error);
  }
};
