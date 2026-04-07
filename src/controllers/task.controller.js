const {
  postTask,
  selectAllTasks,
  selectTaskById,
  patchTaskStatus,
  deleteTask,
} = require("../models/task.model");

exports.createTask = (req, res) => {
  const taskData = req.body;

  postTask(taskData)
    .then((newTask) => {
      res.status(201).json(newTask);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ error: "Failed to create task" });
    });
};

exports.getAllTasks = (req, res) => {
  selectAllTasks()
    .then((tasks) => {
      res.json(tasks);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ error: "Failed to retrieve tasks" });
    });
};

exports.getTaskById = (req, res) => {
  const taskId = req.params.id;

  if (isNaN(taskId)) {
    return res.status(400).json({ error: "Invalid task ID" });
  }

  selectTaskById(taskId)
    .then((task) => {
      if (!task) {
        return res.status(404).json({ error: "Task not found" });
      }
      res.json(task);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ error: "Failed to retrieve task" });
    });
};

exports.updateTaskStatus = (req, res) => {
  const taskId = req.params.id;
  const { status } = req.body;

  if (isNaN(taskId)) {
    return res.status(400).json({ error: "Invalid task ID" });
  }

  if (
    !status ||
    ["pending", "in-progress", "completed"].includes(status) === -1
  ) {
    return res.status(400).json({ error: "Status is required" });
  }

  patchTaskStatus(taskId, status)
    .then((updatedTask) => {
      if (!updatedTask) {
        return res.status(404).json({ error: "Task not found" });
      }
      res.json(updatedTask);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ error: "Failed to update task status" });
    });
};

exports.removeTask = (req, res) => {
  const taskId = req.params.id;

  if (isNaN(taskId)) {
    return res.status(400).json({ error: "Invalid task ID" });
  }

  deleteTask(taskId)
    .then((deletedTask) => {
      if (!deletedTask) {
        return res.status(404).json({ error: "Task not found" });
      }
      res.status(204).send();
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ error: "Failed to delete task" });
    });
};
