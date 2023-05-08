const request = require("supertest");
const express = require("express");
const userService = require("./user.service");
jest.mock("./user.service.js");
const userError = require("./user-error-handler/user.errors");
jest.mock("./user-error-handler/user.errors");
const userController = require("./user.controller");
const bcrypt = require("bcrypt");
jest.mock("bcrypt");

const app = express();

const mockAuthenticationMiddleware = (req, res, next) => {
  req.user = { _id: "1" };
  next();
};

app.use(mockAuthenticationMiddleware);

app.use(express.json());
app.get("/user/:id", userController.findById);
app.post("/user", userController.create);
app.put("/user/:id", userController.update);
app.post("/user/forgot-password", userController.forgotPass);

const mockUserData = [
  {
    _id: "1",
    role: 1,
    password: "$2b$10$j/mB/v/EbAVPvh3jK2QcZuU6ikzUJLq3svrqy2mb1vKsr1wJ8geZ.",
    name: "József Kovács",
    email: "kovacs.jozsef@example.com",
  },
  {
    _id: "2",
    role: 2,
    password: "$2b$10$TGzUp1VQ4XB/Jd/f4ro7JuPv.0n98iBo1tDgEsiZp9a58z8jKsN0m",
    name: "Anna Nagy",
    email: "nagy.anna@example.com",
  },
];

const mockProductData = [
  {
    _id: "1",
    gameId: "game1",
    sellerId: "user1",
    price: 100,
    condition: "new",
  },
  {
    _id: "2",
    gameId: "game2",
    sellerId: "user1",
    price: 200,
    condition: "used",
  },
  {
    _id: "3",
    gameId: "game3",
    sellerId: "user2",
    price: 150,
    condition: "new",
  },
];

const mockGameData = [
  {
    _id: "game1",
    title: "Game 1",
  },
  {
    _id: "game2",
    title: "Game 2",
  },
  {
    _id: "game3",
    title: "Game 3",
  },
];

userService.__setMockData(mockProductData, mockUserData, mockGameData);

describe("UserController tests", () => {
  // forgotPass() tests
  test("forgot password with valid email", async () => {
    const email = "kovacs.jozsef@example.com";

    const response = await request(app)
      .post("/user/forgot-password")
      .send({ email });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: "We sent your new password!" });
  });
});

describe("UserController findById tests", () => {
  const originalUser = {
    _id: "1",
    role: 1,
    password: "$2b$10$j/mB/v/EbAVPvh3jK2QcZuU6ikzUJLq3svrqy2mb1vKsr1wJ8geZ.",
    name: "József Kovács",
    email: "kovacs.jozsef@example.com",
  };

  const req = {
    params: { id: originalUser._id },
    user: { _id: originalUser._id },
  };

  test("findById should return a user if the user exists and the logged-in user has the same ID", async () => {
    userService.findById.mockResolvedValue(originalUser);

    const response = await request(app).get(`/user/${originalUser._id}`);

    expect(response.status).toBe(200);
    expect(response.body).toEqual(originalUser);
  });

  test("findById should return a 400 Bad Request error if the user ID is invalid", async () => {
    const invalidUserId = "invalid_id";
    userError.validateUserId.mockReturnValue("Invalid user ID");

    const response = await request(app).get(`/user/${invalidUserId}`);

    expect(response.status).toBe(403);
  });

  test("findById should return a 400 Not Found error if the user does not exist", async () => {
    userService.findById.mockResolvedValue(null);
    userError.userNotFound.mockReturnValue("User not found");

    const response = await request(app).get(`/user/${originalUser._id}`);

    expect(response.status).toBe(400);
  });
});

describe("UserController create tests", () => {
  const newUser = {
    name: "Péter Szabó",
    email: "szabo.peter@example.com",
    password: "password123",
    role: 1,
    phone: "123-456-7890",
    address: {
      street: "Kossuth Lajos utca 1.",
      city: "Budapest",
      country: "Hungary",
      zip: "1051",
    },
  };

  beforeEach(() => {
    userError.isEmailRegistered.mockResolvedValue(false);
    bcrypt.hash = jest
      .fn()
      .mockImplementation(async (password, saltRounds) => "hashedPassword");
  });

  test("create should return a 201 status if registration is successful", async () => {
    const response = await request(app).post("/user").send(newUser);

    expect(response.status).toBe(201);
    expect(response.body).toEqual({ message: "Registration successful!" });
    expect(userService.create).toHaveBeenCalledWith({
      ...newUser,
      password: "hashedPassword",
    });
  });
});

// updata user tests

const existingUser = {
  _id: "1",
  name: "John Doe",
  email: "john.doe@example.com",
  password: "password123",
  role: 1,
  phone: "123-456-7890",
  address: {
    street: "Main Street 1",
    city: "New York",
    country: "USA",
    zip: "10001",
  },
};

const updatedUser = {
  name: "John Doe Updated",
  email: "john.doe.updated@example.com",
  password: "password123",
  newPassword: "newPassword123",
  role: 1,
  phone: "987-654-3210",
  address: {
    street: "Updated Street 2",
    city: "New York",
    country: "USA",
    zip: "10002",
  },
};

describe("UserController update tests", () => {
  beforeEach(() => {
    userService.findById.mockResolvedValue(existingUser);
    bcrypt.compare = jest.fn().mockResolvedValue(true);
    bcrypt.hash = jest.fn().mockResolvedValue("hashedNewPassword");
    userService.update.mockResolvedValue({ ...existingUser, ...updatedUser });
  });

  test("update should return a 200 status if update is successful", async () => {
    const response = await request(app)
      .put(`/user/${existingUser._id}`)
      .send(updatedUser);
    expect(response.status).toBe(200);
  });
});
