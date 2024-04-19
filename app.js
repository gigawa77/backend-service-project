const express = require("express");

const {
  getHealthCheck,
  getTopics,
  getEndpoints,
  getArticleId,
  getAllArticles,
  getCommentsById,
} = require("./controllers/controller");

const app = express();

app.get("/api/healthcheck", getHealthCheck);

app.get("/api/topics", getTopics);

app.get("/api", getEndpoints);

app.get("/api/articles/:article_id", getArticleId);

app.get("/api/articles", getAllArticles);

app.get("/api/articles/:article_id/comments", getCommentsById);

app.all("*", (req, res, next) => {
  res.status(404).send({ message: "Endpoint not found" });
});

app.use((err, req, res, next) => {
  if (err.status && err.message) {
    res.status(err.status).send({ message: err.message });
  }
  next(err);
});

app.use((err, req, res, next) => {
  if (err.code === "22P02") {
    res.status(400).send({ message: "Bad request" });
  }
});
module.exports = app;