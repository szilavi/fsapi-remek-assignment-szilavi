const mongoose = require("mongoose");

const GameSchema = mongoose.Schema({
  title: String,
  releaseDate: String,
  description: String,
});

module.exports = mongoose.model("game", GameSchema);
