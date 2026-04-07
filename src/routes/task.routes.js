const express = require("express");
const {
  createTask,
  getAllTasks,
  getTaskById,
} = require("../controllers/task.controller");
const { validateTask } = require("../middleware/task.middleware");

const router = express.Router();

router.get("/tasks", getAllTasks);
router.get("/tasks/:id", getTaskById);
router.post("/tasks", validateTask, createTask);

module.exports = router;
