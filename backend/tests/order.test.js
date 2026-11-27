const mongoose = require("mongoose");
const request = require("supertest");
const authService = require("../services/auth.service");
const app = require("../app");
const Product = require("../models/product.model");

require("dotenv").config();

beforeAll(async () => {
  await mongoose.connect(process.env.MONGODB_URI);
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe("Requests for /api/orders", () => {
  let token;
  let createdOrderId;
  let product;

  afterAll(async () => {
    if (product) await Product.deleteOne({ _id: product._id });
  });

  beforeAll(() => {
    const user = {
      _id: new mongoose.Types.ObjectId().toString(),
      username: "admin",
      email: "gtzempe@gmail.com",
      roles: ["EDITOR", "READER", "ADMIN"],
    };
    token = authService.generateAccessToken(user);
  });

  it("GET Returns all orders", async () => {
    const res = await request(app)
      .get("/api/orders")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBeTruthy();
    expect(Array.isArray(res.body.data)).toBe(true);
  }, 10000);

  it("POST Creates a new order", async () => {
    product = await Product.create({
      product: "Order Test " + new mongoose.Types.ObjectId(),
      description: "Order test fixture",
      category: "Test",
      image: "http://example.com/product.jpg",
      price: 500,
      stock: 2,
    });
    const res = await request(app)
      .post("/api/orders")
      .set("Authorization", `Bearer ${token}`)
      .send({
        userId: new mongoose.Types.ObjectId().toString(),
        username: "orderuser",
        items: [
          {
            productId: product.id,
            product: "Order Test Product",
            image: "http://example.com/product.jpg",
            quantity: 2,
            price: 500,
          },
        ],
        shippingAddress: {
          road: "Main St",
          area: "Athens",
        },
        totalCost: 1000,
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.status).toBeTruthy();
    expect(res.body.data).toHaveProperty("id");
    createdOrderId = res.body.data.id;
  }, 10000);

  it("GET Returns one order by ID", async () => {
    const res = await request(app)
      .get(`/api/orders/${createdOrderId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBeTruthy();
    expect(res.body.data).toHaveProperty("id", createdOrderId);
  }, 10000);

  it("PUT Updates an order by ID", async () => {
    const res = await request(app)
      .put(`/api/orders/${createdOrderId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ status: "completed" });

    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBeTruthy();
    expect(res.body.data).toHaveProperty("id", createdOrderId);
  }, 10000);

  it("DELETE Removes an order by ID", async () => {
    const res = await request(app)
      .delete(`/api/orders/${createdOrderId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBeTruthy();
  }, 10000);
});
