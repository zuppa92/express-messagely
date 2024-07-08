const request = require("supertest");
const app = require("../app");
const db = require("../db");
const User = require("../models/user");

describe("Auth Routes", function () {
  beforeEach(async function () {
    await db.query("DELETE FROM messages");
    await db.query("DELETE FROM users");
    await User.register({
      username: "testuser",
      password: "password",
      first_name: "Test",
      last_name: "User",
      phone: "123-456-7890"
    });
  });

  /** POST /auth/register - register a new user */
  test("POST /auth/register - register a new user", async function () {
    const response = await request(app)
      .post("/auth/register")
      .send({
        username: "newuser",
        password: "password",
        first_name: "New",
        last_name: "User",
        phone: "987-654-3210"
      });

    expect(response.statusCode).toBe(201);
    expect(response.body).toEqual({
      token: expect.any(String)
    });
  });

  /** POST /auth/login - login a user */
  test("POST /auth/login - login a user", async function () {
    const response = await request(app)
      .post("/auth/login")
      .send({
        username: "testuser",
        password: "password"
      });

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      token: expect.any(String)
    });
  });
});
