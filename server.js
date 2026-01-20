const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

/* -------------------- MongoDB Connection -------------------- */
async function connectDB() {
  await mongoose.connect(process.env.MONGO_URL);
  console.log("MongoDB Connected");
}

connectDB().catch(err => console.log("MongoDB Error:", err));

/* -------------------- Task Model -------------------- */
const TaskSchema = new mongoose.Schema({
  title: String
});

const Task = mongoose.model("Task", TaskSchema);

/* -------------------- Routes -------------------- */

app.get("/", (req, res) => {
  res.send("Backend is Live with Database");
});

app.get("/tasks", async (req, res) => {
  const tasks = await Task.find();
  res.json(tasks);
});

app.post("/tasks", async (req, res) => {
  const task = new Task({ title: req.body.title });
  await task.save();
  res.status(201).json(task);
});

app.delete("/tasks/:id", async (req, res) => {
  await Task.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
});

/* -------------------- Server -------------------- */
const PORT = process.env.PORT || 3000;

if (require.main === module) {
  app.listen(PORT, () => console.log("Running on " + PORT));
}

module.exports = app;
