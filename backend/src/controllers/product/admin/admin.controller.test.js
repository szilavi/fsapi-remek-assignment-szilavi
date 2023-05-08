const request = require("supertest");
const express = require("express");
const adminService = require("./admin.service");
jest.mock("./admin.service.js");
const adminController = require("./admin.controller");

const app = express();

app.use(express.json());
app.get("/products", adminController.findAll);
app.get("/product/:id", adminController.findById);

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

const mockUserData = [
  {
    _id: "user1",
    name: "User 1",
  },
  {
    _id: "user2",
    name: "User 2",
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

adminService.__setMockData(mockProductData, mockUserData, mockGameData);

beforeEach(() => {
  jest.clearAllMocks();

  adminService.findAll.mockImplementation(() => {
    return Promise.resolve(
      mockProductData.map((product) => {
        const game = mockGameData.find((game) => game._id === product.gameId);
        const user = mockUserData.find((user) => user._id === product.sellerId);

        return {
          ...product,
          gameId: game ? [game.title] : [],
          sellerId: user ? [user.name] : [],
        };
      })
    );
  });
});

describe("AdminController tests", () => {
  // findAll() tests

  test("should return all products with correct data when findAll is called", async () => {
    const expectedResponse = [
      {
        _id: "1",
        gameId: ["Game 1"],
        sellerId: ["User 1"],
        price: 100,
        condition: "new",
      },
      {
        _id: "2",
        gameId: ["Game 2"],
        sellerId: ["User 1"],
        price: 200,
        condition: "used",
      },
      {
        _id: "3",
        gameId: ["Game 3"],
        sellerId: ["User 2"],
        price: 150,
        condition: "new",
      },
    ];

    const response = await request(app).get("/products");

    expect(response.status).toEqual(200);
    expect(response.body).toEqual(expectedResponse);
    expect(adminService.findAll).toHaveBeenCalled();
  });

  // findById() tests

  test("should return a single product with correct data when findById is called", async () => {
    const productId = "1";
    const expectedResponse = {
      _id: "user1",
      gameId: "game1",
      title: "Game 1",
      sellerId: "user1",
      name: "User 1",
      price: 100,
      condition: "new",
    };

    adminService.findById.mockImplementation((id) => {
      const product = mockProductData.find((product) => product._id === id);
      if (!product) {
        return Promise.resolve(null);
      }

      const game = mockGameData.find((game) => game._id === product.gameId);
      const user = mockUserData.find((user) => user._id === product.sellerId);

      return Promise.resolve({
        ...product,
        ...game,
        ...user,
      });
    });

    const response = await request(app).get(`/product/${productId}`);

    expect(response.status).toEqual(200);
    expect(response.body).toEqual(expectedResponse);
    expect(adminService.findById).toHaveBeenCalledWith(productId);
  });
});
