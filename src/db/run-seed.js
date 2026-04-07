const devData = require("./data/testTasks");
const seed = require("./seed");
const db = require("./connection");

const runSeed = () => {
  return seed(devData)
    .then(() => db.end())
    .catch((err) => {
      console.error("Error running seed:", err);
      db.end();
    });
};

runSeed();
