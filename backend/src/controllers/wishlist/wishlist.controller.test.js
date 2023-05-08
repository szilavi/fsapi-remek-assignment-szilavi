const request = require("supertest");
const express = require("express");
const wishlistService = require("./wishlist.service");
jest.mock("./wishlist.service.js");
const wishlistController = require("./wishlist.controller");

const app = express();

app.use(express.json());
app.get("/wishlist/:userId", wishlistController.findById);
app.post("/wishlist", wishlistController.create);
app.delete("/wishlist/:id", wishlistController.findWishAndDelete);

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

wishlistService.__setMockData(mockWishlistData);

describe("WishlistController tests", () => {
  // findById() tests
  test("findById() with valid ID", async () => {
    const userId = "user1";
    const expectedWishlist = [
      { _id: "1", gameTitle: "Game 1" },
      { _id: "2", gameTitle: "Game 2" },
    ];

    const response = await request(app).get(`/wishlist/${userId}`);

    expect(response.status).toBe(200);
    expect(response.body).toEqual(expectedWishlist);
    expect(wishlistService.findById).toHaveBeenCalledWith(userId);
  });

  test("findById() with invalid ID", async () => {
    const invalidUserId = "nonexistent";
    const response = await request(app).get(`/wishlist/${invalidUserId}`);

    expect(response.status).toBe(404);
    expect(wishlistService.findById).toHaveBeenCalledWith(invalidUserId);
  });

  // create() tests

  test("create() should return 201 status when successfully adding a wishlist item", async () => {
    const mockWishlistItem = { title: "Game 1" };

    wishlistService.create.mockResolvedValue();

    const response = await request(app)
      .post("/wishlist")
      .send(mockWishlistItem);

    expect(response.status).toBe(201);
    expect(response.body).toEqual({ message: "Added to your wislist!" });
    expect(wishlistService.create).toHaveBeenCalledWith(mockWishlistItem);
  });

  test("create() should return 500 status when wishlistService.create throws an error", async () => {
    const mockWishlistItem = { title: "Game 1" };
    const mockError = new Error("An error occurred");

    wishlistService.create.mockRejectedValue(mockError);

    const response = await request(app)
      .post("/wishlist")
      .send(mockWishlistItem);

    expect(response.status).toBe(500);
    expect(wishlistService.create).toHaveBeenCalledWith(mockWishlistItem);
  });

  // findWishAndDelete() test

  test("findWishAndDelete() should return 200 status when deleting an existing wishlist item", async () => {
    const mockWishlistItem = { _id: "1" };

    wishlistService.findAndDelete.mockResolvedValue(mockWishlistItem);

    const response = await request(app).delete(
      `/wishlist/${mockWishlistItem._id}`
    );

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: "Delete successful" });
    expect(wishlistService.findAndDelete).toHaveBeenCalledWith(
      mockWishlistItem._id
    );
  });

  test("findWishAndDelete() should return 404 status when deleting a non-existent wishlist item", async () => {
    const mockWishlistItem = { _id: "1" };

    wishlistService.findAndDelete.mockResolvedValue(null);

    const response = await request(app).delete(
      `/wishlist/${mockWishlistItem._id}`
    );

    expect(response.status).toBe(404);
    expect(response.body).toEqual({ message: "Wish not found" });
    expect(wishlistService.findAndDelete).toHaveBeenCalledWith(
      mockWishlistItem._id
    );
  });

  test("findWishAndDelete() should return 500 status when wishlistService.findAndDelete throws an error", async () => {
    const mockWishlistItem = { _id: "1" };
    const mockError = new Error("An error occurred");

    wishlistService.findAndDelete.mockRejectedValue(mockError);

    const response = await request(app).delete(
      `/wishlist/${mockWishlistItem._id}`
    );

    expect(response.status).toBe(500);
    expect(wishlistService.findAndDelete).toHaveBeenCalledWith(
      mockWishlistItem._id
    );
  });
});
