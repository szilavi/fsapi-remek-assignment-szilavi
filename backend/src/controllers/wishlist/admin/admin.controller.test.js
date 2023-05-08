const request = require("supertest");
const express = require("express");
const adminService = require("./admin.service");
jest.mock("./admin.service.js");
const adminController = require("./admin.controller");

const app = express();

app.use(express.json());
app.get("/admin", adminController.findAll);

const mockWishlistData = [
  {
    _id: "1",
    userId: "user1",
    gameId: { title: "Game 1" },
  },
  {
    _id: "2",
    userId: "user1",
    gameId: { title: "Game 2" },
  },
  {
    _id: "3",
    userId: "user2",
    gameId: { title: "Game 3" },
  },
];

adminService.__setMockData(mockWishlistData);

describe("AdminController tests", () => {
  // findAll() tests
  test("findAll() should return all wishlist items with user and game details", async () => {
    adminService.findAll.mockResolvedValue([
      {
        _id: "1",
        userId: ["User 1"],
        gameId: ["Game 1"],
      },
      {
        _id: "2",
        userId: ["User 1"],
        gameId: ["Game 2"],
      },
      {
        _id: "3",
        userId: ["User 2"],
        gameId: ["Game 3"],
      },
    ]);

    const expectedWishlist = [
      {
        _id: "1",
        userId: ["User 1"],
        gameId: ["Game 1"],
      },
      {
        _id: "2",
        userId: ["User 1"],
        gameId: ["Game 2"],
      },
      {
        _id: "3",
        userId: ["User 2"],
        gameId: ["Game 3"],
      },
    ];

    const response = await request(app).get("/admin");

    expect(response.status).toBe(200);
    expect(response.body).toEqual(expectedWishlist);
    expect(adminService.findAll).toHaveBeenCalled();
  });
});
