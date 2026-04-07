const { postTask } = require("../models/task.model");

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
