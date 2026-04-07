const {
  postTask,
  selectAllTasks,
  selectTaskById,
} = require("../models/task.model");

exports.createTask = (req, res) => {
  console.log("Received request to create task with data:", req.body);
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
