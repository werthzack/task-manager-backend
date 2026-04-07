const request = require("supertest");
const app = require("../src/server");
const pool = require("../src/db/connection");
const seed = require("../src/db/seed");
const testTasks = require("../src/db/data/testTasks");

beforeEach(() => {
  return seed(testTasks);
});

afterAll(() => {
  return pool.end();
});

describe("GET /", () => {
  it("should return status OK", async () => {
    return request(app)
      .get("/")
      .expect(200)
      .then((response) => {
        expect(response.body).toEqual({ status: "OK" });
      });
  });
});
