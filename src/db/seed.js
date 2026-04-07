const pool = require("./connection");

const seed = (tasksData) => {
  console.log("Seeding database...");
  return pool
    .query("DROP TABLE IF EXISTS tasks")
    .then(() => {
      return pool.query(`CREATE TABLE tasks (
            id SERIAL PRIMARY KEY,
            title VARCHAR(255) NOT NULL,
            description TEXT,
            status VARCHAR(50) NOT NULL DEFAULT 'pending',
            due_date TIMESTAMPTZ NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`);
    })
    .then(() => {
      const insertQuery = `INSERT INTO tasks (title, description, status, due_date) VALUES %L RETURNING *`;
      const values = tasksData.map((task) => [
        task.title,
        task.description,
        task.status,
        task.due_date,
      ]);
      return pool.query(require("pg-format")(insertQuery, values));
    })
    .then(() => {
      console.log("Database seeded successfully");
    })
    .catch((err) => {
      console.error("Error seeding database:", err);
      throw err;
    });
};

module.exports = seed;
