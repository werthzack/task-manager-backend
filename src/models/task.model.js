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
