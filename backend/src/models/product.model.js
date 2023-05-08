const mongoose = require("mongoose");
const { Schema, Types } = mongoose;
const ObjectId = Types.ObjectId;

const ProductSchema = mongoose.Schema(
  {
    gameId: { type: Schema.Types.ObjectId, ref: "game" },
    sellerId: ObjectId,
    status: String,
    condition: {
      type: String,
      required: false,
    },
    price: {
      type: Number,
      required: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("listing", ProductSchema);
