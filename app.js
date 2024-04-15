const express = require("express");

const { getHealthCheck, getTopics } = require("./controllers/controller");

const app = express();

// app.use(express.json());

app.get("/api/healthcheck", getHealthCheck);

app.get("/api/topics", getTopics);

app.all("*", (req, res, next) => {
  res.status(404).send({ message: "Endpoint not found" });
});

module.exports = app;
