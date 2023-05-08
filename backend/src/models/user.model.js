const mongoose = require("mongoose");

const AddressSchema = mongoose.Schema({
  street: String,
  city: String,
  country: String,
  zip: Number,
});

const UserSchema = mongoose.Schema(
  {
    role: Number,
    password: String,
    name: String,
    email: String,
    phone: String,
    address: AddressSchema,
  },
  { timestamps: true }
);

module.exports = mongoose.model("user", UserSchema);
