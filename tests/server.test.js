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
      status: "pending",
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
        status: "pending",
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
      .send({ title: "No date", status: "pending" })
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
        status: "pending",
        due_date: "2024-12-31T23:59:59Z",
      })
      .expect(201)
      .then((response) => {
        expect(response.body).toMatchObject({
          id: expect.any(Number),
          title: "No description",
          description: null,
          status: "pending",
          due_date: expect.any(String),
        });
      });
  });
});

describe("GET /api/tasks", () => {
  it("should return all tasks", () => {
    return request(app)
      .get("/api/tasks")
      .expect(200)
      .then((response) => {
        expect(response.body).toHaveLength(testTasks.length);
        response.body.forEach((task, index) => {
          expect(task).toMatchObject({
            id: expect.any(Number),
            title: testTasks[index].title,
            description: testTasks[index].description,
            status: testTasks[index].status,
            due_date: expect.any(String),
          });
          expect(new Date(task.due_date).getTime()).toBe(
            new Date(testTasks[index].due_date).getTime(),
          );
        });
      });
  });

  it("should return an empty array when no tasks exist", () => {
    return pool.query("DELETE FROM tasks").then(() => {
      return request(app)
        .get("/api/tasks")
        .expect(200)
        .then((response) => {
          expect(Array.isArray(response.body)).toBe(true);
          expect(response.body).toHaveLength(0);
        });
    });
  });
});

describe("GET /api/tasks/:id", () => {
  it("should return a task by id", () => {
    return pool.query("SELECT * FROM tasks LIMIT 1").then((result) => {
      const task = result.rows[0];
      return request(app)
        .get(`/api/tasks/${task.id}`)
        .expect(200)
        .then((response) => {
          expect(response.body).toMatchObject({
            id: task.id,
            title: task.title,
            description: task.description,
            status: task.status,
            due_date: expect.any(String),
          });
        });
    });
  });

  it("should return 404 if task does not exist", () => {
    return request(app)
      .get("/api/tasks/99999")
      .expect(404)
      .then((response) => {
        expect(response.body).toMatchObject({ error: expect.any(String) });
      });
  });

  it("should return 400 if id is not a number", () => {
    return request(app)
      .get("/api/tasks/notanid")
      .expect(400)
      .then((response) => {
        expect(response.body).toMatchObject({ error: expect.any(String) });
      });
  });
});

describe("PATCH /api/tasks/:id/status", () => {
  it("should update the status of a task", () => {
    return pool.query("SELECT * FROM tasks LIMIT 1").then((result) => {
      const task = result.rows[0];
      return request(app)
        .patch(`/api/tasks/${task.id}/status`)
        .send({ status: "in-progress" })
        .expect(200)
        .then((response) => {
          expect(response.body).toMatchObject({
            id: task.id,
            status: "in-progress",
          });
        });
    });
  });

  it("should return 400 if status is invalid", () => {
    return pool.query("SELECT * FROM tasks LIMIT 1").then((result) => {
      const task = result.rows[0];
      return request(app)
        .patch(`/api/tasks/${task.id}/status`)
        .send({ status: "invalid-status" })
        .expect(400)
        .then((response) => {
          expect(response.body).toMatchObject({ error: expect.any(String) });
        });
    });
  });

  it("should return 404 if task does not exist", () => {
    return request(app)
      .patch("/api/tasks/99999/status")
      .send({ status: "in-progress" })
      .expect(404)
      .then((response) => {
        expect(response.body).toMatchObject({ error: expect.any(String) });
      });
  });
});
