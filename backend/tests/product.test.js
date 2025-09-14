const mongoose = require("mongoose");
const request = require("supertest");
const authService = require("../services/auth.service");
const app = require("../app");

require("dotenv").config();

beforeAll(async () => {
  await mongoose.connect(process.env.MONGODB_URI);
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe("Requests for /api/products", () => {
  let token;
  let createdProductId;

  beforeAll(() => {
    const user = {
      username: "admin",
      email: "gtzempe@gmail.com",
      roles: ["EDITOR", "READER", "ADMIN"],
    };
    token = authService.generateAccessToken(user);
  });

  it("GET Returns all products", async () => {
    const res = await request(app)
      .get("/api/products")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBeTruthy();
    expect(Array.isArray(res.body.data)).toBe(true);
  }, 10000);

  it("POST Creates a new product", async () => {
    const res = await request(app)
      .post("/api/products")
      .set("Authorization", `Bearer ${token}`)
      .send({
        product: "Product Test",
        description: "Product test created",
        category: "Test",
        image: "http://example.com/laptop.jpg",
        price: 1500,
        stock: 10,
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.status).toBeTruthy();
    expect(res.body.data).toHaveProperty("id");
    createdProductId = res.body.data.id;
  }, 10000);

  it("GET Returns one product by ID", async () => {
    const res = await request(app)
      .get(`/api/products/${createdProductId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBeTruthy();
    expect(res.body.data).toHaveProperty("id", createdProductId);
  }, 10000);

  it("PUT Updates a product by ID", async () => {
    const res = await request(app)
      .put(`/api/products/${createdProductId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ product: "Updated Product Test" });

    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBeTruthy();
    expect(res.body.data).toHaveProperty("product", "Updated Product Test");
  }, 10000);

  it("DELETE Removes a product by ID", async () => {
    const res = await request(app)
      .delete(`/api/products/${createdProductId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBeTruthy();
  }, 10000);
});
