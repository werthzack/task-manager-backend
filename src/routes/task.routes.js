const express = require("express");
const { createTask } = require("../controllers/task.controller");
const { validateTask } = require("../middleware/task.middleware");

const router = express.Router();

router.post("/tasks", validateTask, createTask);

module.exports = router;
