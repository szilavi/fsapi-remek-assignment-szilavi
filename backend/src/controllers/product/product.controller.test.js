const request = require("supertest");
const express = require("express");
const productService = require("./product.service");
jest.mock("./product.service.js");
const productController = require("./product.controller");

const app = express();

app.use(express.json());
app.get("/products", productController.findAll);
app.get("/product/:id", productController.findById);
app.post("/product", productController.create);
app.get("/product/user/:userId", productController.findProductsByUserId);
app.patch("/product/buy/:id", productController.findProductAndUpdate);
app.delete("/product/:id", productController.findProductAndDelete);
app.get("/product/game/search", productController.findGameByTitle);

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

productService.__setMockData(mockProductData, mockUserData, mockGameData);

describe("ProductController tests", () => {
  //f findAll() tests

  test("findAll() should return 200 status and all products", async () => {
    const expectedProducts = mockProductData.map((product) => {
      const game = mockGameData.find((game) => game._id === product.gameId);
      const user = mockUserData.find((user) => user._id === product.sellerId);
      return {
        ...product,
        gameId: game ? [game.title] : [],
        sellerId: user ? [user.name] : [],
      };
    });

    productService.findAll.mockResolvedValue(expectedProducts);

    const response = await request(app).get("/products");

    expect(response.status).toBe(200);
    expect(response.body).toEqual(expectedProducts);
    expect(productService.findAll).toHaveBeenCalled();
  });

  // findById() tests

  test("findById() should return the product with the given id", async () => {
    const mockId = "1";
    const expectedProduct = {
      _id: "1",
      gameId: "game1",
      sellerId: "user1",
      price: 100,
      condition: "new",
    };

    productService.findById.mockResolvedValue(expectedProduct);

    const response = await request(app).get(`/product/${mockId}`);

    expect(response.status).toBe(200);
    expect(response.body).toEqual(expectedProduct);
    expect(productService.findById).toHaveBeenCalledWith(mockId);
  });

  // create() tests
  test("create() should return 201 status when successfully creating a product", async () => {
    const mockProduct = {
      gameId: "game1",
      sellerId: "user1",
      price: 100,
      condition: "new",
    };

    productService.create.mockResolvedValue();

    const response = await request(app).post("/product").send(mockProduct);

    expect(response.status).toBe(201);
    expect(response.body).toEqual({ message: "You made an offer!" });
    expect(productService.create).toHaveBeenCalledWith(mockProduct);
  });

  test("create() should return 500 status when productService.create throws an error", async () => {
    const mockProduct = {
      gameId: "game1",
      sellerId: "user1",
      price: 100,
      condition: "new",
    };
    const mockError = new Error("An error occurred");

    productService.create.mockRejectedValue(mockError);

    const response = await request(app).post("/product").send(mockProduct);

    expect(response.status).toBe(500);
    expect(productService.create).toHaveBeenCalledWith(mockProduct);
  });

  // findProductsByUserId() tests

  test("findProductsByUserId() should return 200 status and products with matching userId", async () => {
    const mockUserId = "user1";
    const expectedProducts = [
      {
        _id: "1",
        gameTitle: "Game 1",
        price: 10,
        status: "offer",
      },
      {
        _id: "2",
        gameTitle: "Game 2",
        price: 20,
        status: "offer",
      },
    ];

    productService.findProductsByUserId.mockResolvedValue(expectedProducts);

    const response = await request(app).get(`/product/user/${mockUserId}`);

    expect(response.status).toBe(200);
    expect(response.body).toEqual(expectedProducts);
    expect(productService.findProductsByUserId).toHaveBeenCalledWith(
      mockUserId
    );
  });

  test("findProductsByUserId() should return 500 status when productService.findProductsByUserId throws an error", async () => {
    const mockUserId = "user1";
    const mockError = new Error("An error occurred");

    productService.findProductsByUserId.mockRejectedValue(mockError);

    const response = await request(app).get(`/product/user/${mockUserId}`);

    expect(response.status).toBe(500);
    expect(productService.findProductsByUserId).toHaveBeenCalledWith(
      mockUserId
    );
  });

  // findProductAndUpdate() tests

  test("findProductAndUpdate() should return 200 status and a DEAL! message when successfully updating a product", async () => {
    const mockOfferId = "1";

    productService.findProductAndUpdate.mockResolvedValue();

    const response = await request(app).patch(`/product/buy/${mockOfferId}`);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: "DEAL!" });
    expect(productService.findProductAndUpdate).toHaveBeenCalledWith(
      mockOfferId
    );
  });

  test("findProductAndUpdate() should return 500 status when productService.findProductAndUpdate throws an error", async () => {
    const mockOfferId = "1";
    const mockError = new Error("An error occurred");

    productService.findProductAndUpdate.mockRejectedValue(mockError);

    const response = await request(app).patch(`/product/buy/${mockOfferId}`);

    expect(response.status).toBe(500);
    expect(productService.findProductAndUpdate).toHaveBeenCalledWith(
      mockOfferId
    );
  });

  test("findProductAndDelete() should return 200 status and a 'Delete successful' message when successfully deleting a product", async () => {
    const mockOfferId = "1";

    productService.findAndDelete.mockResolvedValue();

    const response = await request(app).delete(`/product/${mockOfferId}`);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: "Delete successful" });
    expect(productService.findAndDelete).toHaveBeenCalledWith(mockOfferId);
  });

  test("findProductAndDelete() should return 500 status when productService.findAndDelete throws an error", async () => {
    const mockOfferId = "1";
    const mockError = new Error("An error occurred");

    productService.findAndDelete.mockRejectedValue(mockError);

    const response = await request(app).delete(`/product/${mockOfferId}`);

    expect(response.status).toBe(500);
    expect(productService.findAndDelete).toHaveBeenCalledWith(mockOfferId);
  });

  // findProductByTitle() tests

  test("findGameByTitle() should return games with matching title", async () => {
    const mockTitle = "game1";
    const expectedGames = [{ _id: "game1", title: "Game 1" }];

    productService.findGameByTitle.mockResolvedValue(expectedGames);

    const response = await request(app).get(
      `/product/game/search?title=${mockTitle}`
    );

    expect(response.status).toBe(200);
    expect(response.body).toEqual(expectedGames);
  });
});
