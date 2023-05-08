const mongoose = require("mongoose");
const { Schema, Types } = mongoose;

const WishSchema = new Schema(
  {
    userId: {
      type: Types.ObjectId,
      ref: "user",
    },
    gameId: {
      type: Types.ObjectId,
      ref: "game",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("wish", WishSchema);
