const request = require("supertest");
const express = require("express");
const adminService = require("./admin.service");
jest.mock("./admin.service.js");
const adminController = require("./admin.controller");

const app = express();
app.use(express.json());

app.get("/admin", adminController.findAll);
app.get("/admin/:id", adminController.findById);
app.delete("/admin/:id", adminController.deleteById);

const mockUserData = [
  {
    _id: "1",
    name: "John Doe",
    email: "john.doe@example.com",
    role: 1,
  },
  {
    _id: "2",
    name: "Jane Smith",
    email: "jane.smith@example.com",
    role: 1,
  },
];

adminService.__setMockData(mockUserData);

describe("UserController tests", () => {
  // findAll() test

  test("findAll() with valid ID", async () => {
    adminService.findAll.mockResolvedValue(mockUserData);
    const response = await request(app).get("/admin");

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(mockUserData);
    expect(adminService.findAll).toHaveBeenCalledTimes(1);
  });

  // findById() test

  test("findById() with valid ID", async () => {
    const userId = "1";
    const expectedUser = mockUserData.find((user) => user._id === userId);

    adminService.findById.mockResolvedValue(expectedUser);
    const response = await request(app).get(`/admin/${userId}`);

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(expectedUser);
    expect(adminService.findById).toHaveBeenCalledWith(userId);
    expect(adminService.findById).toHaveBeenCalledTimes(1);
  });

  // deleteById() test

  test("deleteById() with valid ID", async () => {
    const userId = "1";

    // Mock the adminService methods
    adminService.deleteWishesByUserId.mockResolvedValue(2);
    adminService.updateListingsBySellerId.mockResolvedValue(3);
    adminService.deleteUserById.mockResolvedValue(true);

    const response = await request(app).delete(`/admin/${userId}`);

    expect(response.statusCode).toBe(201);
    expect(response.body).toEqual({ message: "User deleted!" });
    expect(adminService.deleteWishesByUserId).toHaveBeenCalledWith(userId);
    expect(adminService.updateListingsBySellerId).toHaveBeenCalledWith(userId);
    expect(adminService.deleteUserById).toHaveBeenCalledWith(userId);

    expect(adminService.deleteWishesByUserId).toHaveBeenCalledTimes(1);
    expect(adminService.updateListingsBySellerId).toHaveBeenCalledTimes(1);
    expect(adminService.deleteUserById).toHaveBeenCalledTimes(1);
  });
});
