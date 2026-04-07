const db = require("../db/connection");

exports.postTask = (taskData) => {
  const { title, description, status, due_date } = taskData;

  const query = `
    INSERT INTO tasks (title, description, status, due_date)
    VALUES ($1, $2, $3, $4)
    RETURNING *
  `;

  const values = [title, description, status, due_date];

  return db.query(query, values).then((result) => {
    return result.rows[0];
  });
};

exports.selectAllTasks = () => {
  const query = `
    SELECT * FROM tasks
  `;

  return db.query(query).then((result) => {
    return result.rows;
  });
};

exports.selectTaskById = (taskId) => {
  const query = `
    SELECT * FROM tasks WHERE id = $1
  `;

  return db.query(query, [taskId]).then((result) => {
    return result.rows[0];
  });
};

exports.patchTaskStatus = (taskId, newStatus) => {
  const query = `
    UPDATE tasks
    SET status = $1
    WHERE id = $2
    RETURNING *
  `;

  return db.query(query, [newStatus, taskId]).then((result) => {
    return result.rows[0];
  });
};

exports.deleteTask = (taskId) => {
  const query = `
    DELETE FROM tasks
    WHERE id = $1
    RETURNING *
  `;

  return db.query(query, [taskId]).then((result) => {
    return result.rows[0];
  });
};
