const User = require("../../../models/user.model");
const mongoose = require("mongoose");

const userError = {};

userError.userSaving = (user) => {
  let errorMessage = "";
  const requiredKeys = ["role", "name", "email", "phone", "password"];

  const requiredAddressKeys = ["street", "city", "country", "zip"];

  const missingKeys = requiredKeys.filter((key) => !user.hasOwnProperty(key));

  if (missingKeys.length > 0) {
    errorMessage = Object.fromEntries(
      missingKeys.map((key) => [key, "is required"])
    );
  }

  if (user.role !== 1) {
    errorMessage = { ...errorMessage, role: "Role must be number 1" };
  }

  if (user.hasOwnProperty("address")) {
    const missingAddressKeys = requiredAddressKeys.filter(
      (key) => !user.address.hasOwnProperty(key)
    );

    if (missingAddressKeys.length > 0) {
      errorMessage = {
        ...errorMessage,
        ...Object.fromEntries(
          missingAddressKeys.map((key) => [`address.${key}`, "is required"])
        ),
      };
    }
  } else {
    errorMessage = { ...errorMessage, address: "Address is required" };
  }

  return errorMessage;
};

userError.validateUserId = (userId) => {
  let errorMessage = "";

  if (!userId) {
    errorMessage = "User ID is required";
  } else if (!mongoose.Types.ObjectId.isValid(userId)) {
    errorMessage = "Invalid User ID format";
  }

  return errorMessage;
};

userError.isEmailRegistered = async (email) => {
  let errorMessage = "";
  const user = await User.findOne({ email });
  if (user !== null) {
    errorMessage = "The email is already registered.";
  }

  return errorMessage;
};

userError.userNotFound = (user) => {
  let errorMessage = "";
  if (!user) {
    errorMessage = "User not found";
  }

  return errorMessage;
};

module.exports = userError;
