const express = require("express");
const cors = require("cors");
const routes = require("./routes/task.routes");
const { errorHandler } = require("./middleware/errorHandling");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).json({ status: "OK" });
});

app.use("/api", routes);

app.use(errorHandler);

module.exports = app;
