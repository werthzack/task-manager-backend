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

describe("POST /api/tasks", () => {
  it("should create a new task", async () => {
    const newTask = {
      title: "New Task",
      description: "This is a new task",
      status: "not-started",
      due_date: "2024-12-31T23:59:59Z",
    };

    return request(app)
      .post("/api/tasks")
      .send(newTask)
      .expect(201)
      .then((response) => {
        expect(response.body).toMatchObject({
          id: expect.any(Number),
          title: newTask.title,
          description: newTask.description,
          status: newTask.status,
          due_date: expect.any(String),
        });
        expect(new Date(response.body.due_date).toISOString()).toBe(
          new Date(newTask.due_date).toISOString(),
        );
      });
  });

  it("should return 400 if title is missing", async () => {
    return request(app)
      .post("/api/tasks")
      .send({
        description: "No title",
        status: "not-started",
        due_date: "2024-12-31T23:59:59Z",
      })
      .expect(400)
      .then((response) => {
        expect(response.body).toMatchObject({ error: expect.any(String) });
      });
  });

  it("should return 400 if due_date is missing", async () => {
    return request(app)
      .post("/api/tasks")
      .send({ title: "No date", status: "not-started" })
      .expect(400)
      .then((response) => {
        expect(response.body).toMatchObject({ error: expect.any(String) });
      });
  });

  it("should create a task with no description", async () => {
    return request(app)
      .post("/api/tasks")
      .send({
        title: "No description",
        status: "not-started",
        due_date: "2024-12-31T23:59:59Z",
      })
      .expect(201)
      .then((response) => {
        expect(response.body).toMatchObject({
          id: expect.any(Number),
          title: "No description",
          description: null,
          status: "not-started",
          due_date: expect.any(String),
        });
      });
  });
});
