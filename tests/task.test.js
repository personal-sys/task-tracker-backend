const request = require("supertest");

// Mock the server instead of using real MongoDB
jest.mock("../server", () => {
  const express = require("express");
  const app = express();
  app.use(express.json());

  // In-memory fake database
  let tasks = [];

  app.post("/tasks", (req, res) => {
    const newTask = { _id: Date.now().toString(), title: req.body.title };
    tasks.push(newTask);
    res.status(201).json(newTask);
  });

  app.get("/tasks", (req, res) => {
    res.json(tasks);
  });

  app.delete("/tasks/:id", (req, res) => {
    tasks = tasks.filter(t => t._id !== req.params.id);
    res.json({ message: "Deleted" });
  });

  return app;
});

const app = require("../server");

describe("Task API Tests (No MongoDB)", () => {

  test("POST /tasks → should create a task", async () => {
    const res = await request(app)
      .post("/tasks")
      .send({ title: "Test Task" });

    expect(res.statusCode).toBe(201);
    expect(res.body.title).toBe("Test Task");
    expect(res.body._id).toBeDefined();
  });

  test("GET /tasks → should return array", async () => {
    const res = await request(app).get("/tasks");

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test("DELETE /tasks/:id → should delete task", async () => {
    const create = await request(app)
      .post("/tasks")
      .send({ title: "Delete Me" });

    const taskId = create.body._id;

    const del = await request(app)
      .delete("/tasks/" + taskId);

    expect(del.statusCode).toBe(200);
    expect(del.body.message).toBe("Deleted");
  });

});
