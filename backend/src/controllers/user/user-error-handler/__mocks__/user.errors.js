const userError = {
  userSaving: jest.fn(),
  validateUserId: jest.fn(),
  userNotFound: jest.fn(),
  isEmailRegistered: jest.fn(),
};

// userSaving

userError.userSaving.mockImplementation((user) => {
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
});

// validateUserId

userError.validateUserId.mockImplementation((userId) => {
  let errorMessage = "";

  if (!userId) {
    errorMessage = "User ID is required";
  }

  return errorMessage;
});

// userNotFound

userError.userNotFound.mockImplementation((user) => {
  let errorMessage = "";
  if (!user) {
    errorMessage = "User not found";
  }

  return errorMessage;
});

// isEmailRegistered

userError.isEmailRegistered.mockImplementation(async (email) => {
  const emailExists = mockData.users.some((u) => u.email === email);
  return Promise.resolve(emailExists);
});

module.exports = userError;
