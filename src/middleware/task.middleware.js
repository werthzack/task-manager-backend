exports.validateTask = (req, res, next) => {
  const { title, due_date } = req.body;

  if (!title || !due_date) {
    return res.status(400).json({ error: "Title and due date are required" });
  }

  next();
};
