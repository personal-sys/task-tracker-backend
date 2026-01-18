const request = require("supertest");
const app = require("../server");

describe("Task API Tests", () => {

  test("POST /tasks → should create a task", async () => {
    const res = await request(app)
      .post("/tasks")
      .send({ title: "Test Task" });

    expect(res.statusCode).toBe(201);
    expect(res.body.title).toBe("Test Task");
    expect(res.body.id).toBeDefined();
  });

  test("GET /tasks → should return array", async () => {
    const res = await request(app).get("/tasks");

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test("DELETE /tasks/:id → should delete task", async () => {
    // First create a task
    const create = await request(app)
      .post("/tasks")
      .send({ title: "Delete Me" });

    const taskId = create.body.id;

    // Then delete it
    const del = await request(app)
      .delete("/tasks/" + taskId);

    expect(del.statusCode).toBe(200);
    expect(del.body.message).toBe("Deleted");
  });

});
