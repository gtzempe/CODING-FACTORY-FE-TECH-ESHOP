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

describe("Requests for /api/users", () => {
  let token;
  let createdUserId;

  beforeAll(() => {
    const user = {
      username: "admin",
      email: "gtzempe@gmail.com",
      roles: ["EDITOR", "READER", "ADMIN"],
    };
    token = authService.generateAccessToken(user);
  });

  it("GET Returns all users", async () => {
    const res = await request(app)
      .get("/api/users")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBeTruthy();
    expect(Array.isArray(res.body.data)).toBe(true);
  }, 10000);

  it("POST Creates a new user", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send({
        username: "newuser",
        password: "123!@#",
        name: "UserName",
        surname: "UserSurname",
        email: "newuser@example.com",
        address: { road: "Main St", area: "Athens" },
        phone: [{ type: "Mobile", number: "6912345678" }],
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.status).toBeTruthy();
    expect(res.body.data).toHaveProperty("_id");
  }, 10000);

  it("GET Returns one user by ID", async () => {
    const res = await request(app)
      .get(`/api/users/newuser`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBeTruthy();
    expect(res.body.data).toHaveProperty("username", "newuser");
  }, 10000);

  it("PUT Updates a user by ID", async () => {
    const res = await request(app)
      .put(`/api/users/newuser`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "UpdatedUser",
        surname: "UserUpdatedSurname",
        address: { road: "Aristotelous", area: "Thessaloniki" },
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBeTruthy();
    expect(res.body.data).toHaveProperty("name", "UpdatedUser");
  }, 10000);

  it("DELETE Removes a user by ID", async () => {
    const res = await request(app)
      .delete(`/api/users/newuser`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBeTruthy();
  }, 10000);
});
