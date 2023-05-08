require("dotenv").config();
const app = require("./server");
const mongoose = require("mongoose");
const request = require("supertest");
const User = require("./models/user.model");
const Wish = require("./models/wish.model");
const Product = require("./models/product.model");
const Game = require("./models/game.model");
const {
  insertUserData,
  insertProductData,
  insertWishData,
  insertGameData,
} = require("./testData");

async function loginUser(
  email = "szilagyi.viktor89@gmail.com",
  password = "testtestQW12"
) {
  let tokens = {};

  await request(app)
    .post("/api/login")
    .send({ email, password })
    .then((res) => {
      tokens.ACCESS_TOKEN = res.body.accessToken;
      tokens.REFRESH_TOKEN = res.body.refreshToken;
    });

  return tokens;
}

describe("REST API integration tests", () => {
  let ACCESS_TOKEN;
  let REFRESH_TOKEN;

  beforeEach(async () => {
    await mongoose.connect("mongodb://127.0.0.1:27017/SuperTestDB");
    console.log("mongoDB connection established!");
    await User.deleteMany({});
  });

  afterEach(async () => {
    await mongoose.connection.db.dropDatabase();
    await mongoose.connection.close();
    console.log("mongoDB connection closed.");
  });

  // login

  test("Login /login", async () => {
    await User.insertMany(insertUserData);
    const loginResponse = await request(app)
      .post("/api/login")
      .send({ email: "szilagyi.viktor89@gmail.com", password: "testtestQW12" });

    expect(loginResponse.status).toBe(200);
    expect(loginResponse.body).toHaveProperty("accessToken");
    expect(loginResponse.body).toHaveProperty("refreshToken");
  });

  // /user registration

  test("POST /user should register user", async () => {
    const registerResponse = await request(app)
      .post("/api/user")
      .send({
        name: "Teszt Felhasználó",
        email: "teszt@felhasznalo.com",
        password: "Teszt1234",
        role: 1,
        phone: "123456789",
        address: {
          street: "Teszt utca 1.",
          city: "Tesztváros",
          country: "Tesztország",
          zip: 1234,
        },
      });

    expect(registerResponse.status).toBe(201);
    expect(registerResponse.body).toEqual({
      message: "Registration successful!",
    });
  });

  // /user/admin/get

  test("GET /user/admin", async () => {
    await User.insertMany(insertUserData);

    const { ACCESS_TOKEN } = await loginUser(
      "dosdepotbcs@gmail.com",
      "DOSBekescsaba12"
    );

    const response = await request(app)
      .get("/api/user/admin")
      .set("authorization", `Bearer ${ACCESS_TOKEN}`);

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBeTruthy();
    expect(response.body.length).toBe(1);
  });

  // /user/:id

  test("GET /user/:id should return user data", async () => {
    await User.insertMany(insertUserData);

    const { ACCESS_TOKEN } = await loginUser();

    const response = await request(app)
      .get("/api/user/642a85504261083035382db0")
      .set("authorization", `Bearer ${ACCESS_TOKEN}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("_id", "642a85504261083035382db0");
    expect(response.body).toHaveProperty(
      "email",
      "szilagyi.viktor89@gmail.com"
    );
  });

  //  /user/:id (unauthorized)

  test("GET /user/:id should return 403 Forbidden when trying to access another user's data", async () => {
    await User.insertMany(insertUserData);

    const { ACCESS_TOKEN } = await loginUser(
      "dosdepotbcs@gmail.com",
      "DOSBekescsaba12"
    );

    const response = await request(app)
      .get("/api/user/642a85504261083035382db0")
      .set("authorization", `Bearer ${ACCESS_TOKEN}`);

    expect(response.status).toBe(403);
  });

  // /user/:id (update user)

  test("PUT /user/:id should update user data", async () => {
    await User.insertMany(insertUserData);

    const { ACCESS_TOKEN } = await loginUser();

    const response = await request(app)
      .put("/api/user/642a85504261083035382db0")
      .set("authorization", `Bearer ${ACCESS_TOKEN}`)
      .send({
        name: "Updated Name",
        password: "testtestQW12",
        newPassword: "newtestQW12",
      });

    expect(response.status).toBe(200);
    expect(response.body).toEqual("Changes saved");
  });

  // /user/forgot-password

  test("POST /user/forgot-password should return a success message", async () => {
    const response = await request(app).post("/api/user/forgot-password").send({
      email: "szilagyi.viktor89@gmail.com",
    });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: "We sent your new password!" });
  });

  // /wishlist/:userId
  test("GET /wishlist/:userId should return wishlist data", async () => {
    await User.insertMany(insertUserData);
    await Wish.insertMany(insertWishData);
    await Game.insertMany(insertGameData);

    const { ACCESS_TOKEN } = await loginUser();

    const response = await request(app)
      .get("/api/wishlist/642a85504261083035382db0")
      .set("authorization", `Bearer ${ACCESS_TOKEN}`);

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBeTruthy();
  });

  // /wishlist (create wish)

  test("POST /wishlist should create a new wishlist item", async () => {
    await User.insertMany(insertUserData);

    const { ACCESS_TOKEN } = await loginUser();

    const response = await request(app)
      .post("/api/wishlist")
      .set("authorization", `Bearer ${ACCESS_TOKEN}`)
      .send({
        userId: "642a85504261083035382db0",
        productId: "5d3a85504261083035382db0",
      });

    expect(response.status).toBe(201);
    expect(response.body).toEqual({ message: "Added to your wislist!" });
  });

  // /wishlist/:id (delete wish)

  test("DELETE /wishlist/:id should delete a wishlist item", async () => {
    await User.insertMany(insertUserData);
    await Wish.insertMany(insertWishData);

    const { ACCESS_TOKEN } = await loginUser();

    const response = await request(app)
      .delete("/api/wishlist/6437f2efebbc8aca19417089")
      .set("authorization", `Bearer ${ACCESS_TOKEN}`);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: "Delete successful" });
  });

  // /wishlist/admin (getAll)

  test("GET /admin should return all wishes", async () => {
    await User.insertMany(insertUserData);
    await Game.insertMany(insertGameData);
    await Wish.insertMany(insertWishData);

    const { ACCESS_TOKEN } = await loginUser(
      "dosdepotbcs@gmail.com",
      "DOSBekescsaba12"
    );

    const response = await request(app)
      .get("/api/wishlist/admin")
      .set("authorization", `Bearer ${ACCESS_TOKEN}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(2);
  });

  // /product (getAll)

  test("GET /products", async () => {
    await Product.insertMany(insertProductData);
    await User.insertMany(insertUserData);
    await Game.insertMany(insertGameData);

    const { ACCESS_TOKEN } = await loginUser();

    const response = await request(app)
      .get("/api/store")
      .set("authorization", `Bearer ${ACCESS_TOKEN}`);

    console.log(response.body);

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBeTruthy();
    expect(response.body.length).toBeGreaterThan(0);
  });

  // /product (create)

  test("POST /store should create a new product", async () => {
    await User.insertMany(insertUserData);

    const { ACCESS_TOKEN } = await loginUser();

    const response = await request(app)
      .post("/api/store")
      .set("authorization", `Bearer ${ACCESS_TOKEN}`)
      .send({
        name: "Teszt termék",
        price: 999,
        description: "Ez egy teszt termék",
      });

    expect(response.status).toBe(201);
    expect(response.body).toEqual({ message: "You made an offer!" });
  });

  // /product/:id (getOne)

  test("GET /store/:id should return product data", async () => {
    await User.insertMany(insertUserData);
    await Product.insertMany(insertProductData);
    await Game.insertMany(insertGameData);

    const { ACCESS_TOKEN } = await loginUser();

    const response = await request(app)
      .get("/api/store/6436709df466d8165924d636")
      .set("authorization", `Bearer ${ACCESS_TOKEN}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("_id", "6436709df466d8165924d636");
    expect(response.body).toHaveProperty("title", "Battle Chess");
  });

  // /product/:id (update)

  test("PUT /store/:id should update product data", async () => {
    await User.insertMany(insertUserData);
    await Product.insertMany(insertProductData);

    const { ACCESS_TOKEN } = await loginUser();

    const response = await request(app)
      .put("/api/store/643670dbf466d8165924d680")
      .set("authorization", `Bearer ${ACCESS_TOKEN}`)
      .send({
        status: "DEAL!",
      });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: "DEAL!" });
  });

  // /product/:id (delete)

  test("DELETE /store/:id should delete a product", async () => {
    await User.insertMany(insertUserData);
    await Product.insertMany(insertProductData);

    const { ACCESS_TOKEN } = await loginUser();

    const response = await request(app)
      .delete("/api/store/6436a7ddbf33e6c6e7259b16")
      .set("authorization", `Bearer ${ACCESS_TOKEN}`);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: "Delete successful" });
  });

  // /store/admin (getAll)

  test("GET /store/admin should return all products with user and game data", async () => {
    await User.insertMany(insertUserData);
    await Game.insertMany(insertGameData);
    await Product.insertMany(insertProductData);

    const { ACCESS_TOKEN } = await loginUser(
      "dosdepotbcs@gmail.com",
      "DOSBekescsaba12"
    );

    const response = await request(app)
      .get("/api/store/admin")
      .set("authorization", `Bearer ${ACCESS_TOKEN}`);

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBeTruthy();
    expect(response.body.length).toBeGreaterThan(0);

    const firstProduct = response.body[0];
    expect(firstProduct).toHaveProperty("gameId");
    expect(firstProduct).toHaveProperty("sellerId");
  });

  test("GET /store/admin/:id should return product with game and user data", async () => {
    await User.insertMany(insertUserData);
    await Game.insertMany(insertGameData);
    await Product.insertMany(insertProductData);

    const { ACCESS_TOKEN } = await loginUser(
      "dosdepotbcs@gmail.com",
      "DOSBekescsaba12"
    );

    const response = await request(app)
      .get("/api/store/admin/6436a7ddbf33e6c6e7259b16")
      .set("authorization", `Bearer ${ACCESS_TOKEN}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("_id", "642a85504261083035382db0");
    expect(response.body).toHaveProperty("title");
    expect(response.body).toHaveProperty("name");
  });

  // refresh token

  test("POST /refresh should generate a new access token", async () => {
    await User.insertMany(insertUserData);

    const { REFRESH_TOKEN } = await loginUser();

    const response = await request(app)
      .post("/api/refresh")
      .send({ refreshToken: REFRESH_TOKEN });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("accessToken");
  });

  test("POST /refresh should return an error for an invalid refresh token", async () => {
    const response = await request(app)
      .post("/api/refresh")
      .send({ refreshToken: "INVALID_REFRESH_TOKEN" });

    expect(response.status).toBe(403);
  });

  // logout

  test("POST /logout should remove the refresh token", async () => {
    await User.insertMany(insertUserData);

    const { REFRESH_TOKEN } = await loginUser();

    const response = await request(app)
      .post("/api/logout")
      .send({ refreshToken: REFRESH_TOKEN });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: "OK" });

    const refreshTokenResponse = await request(app)
      .post("/api/refresh")
      .send({ refreshToken: REFRESH_TOKEN });

    expect(refreshTokenResponse.status).toBe(403);
  });

  // me

  test("GET /me should return the current user's data", async () => {
    await User.insertMany(insertUserData);

    const { ACCESS_TOKEN } = await loginUser();

    const response = await request(app)
      .get("/api/me")
      .set("authorization", `Bearer ${ACCESS_TOKEN}`);

    expect(response.status).toBe(200);

    expect(response.body).toHaveProperty("user");

    const { user } = response.body;
    expect(user).toHaveProperty("email", "szilagyi.viktor89@gmail.com");
  });
});
