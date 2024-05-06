const express = require("express");

const {
  getHealthCheck,
  getTopics,
  getEndpoints,
  getArticleId,
  getAllArticles,
  getCommentsById,
  postNewComment,
  updateVotes,
  deleteComment,
  getUsers,
} = require("./controllers/controller");

const app = express();

app.use(express.json());

app.get("/api/healthcheck", getHealthCheck);

app.get("/api/topics", getTopics);

app.get("/api", getEndpoints);

app.get("/api/articles/:article_id", getArticleId);

app.get("/api/articles", getAllArticles);

app.get("/api/articles/:article_id/comments", getCommentsById);

app.get("/api/users", getUsers);

app.post("/api/articles/:article_id/comments", postNewComment);

app.patch("/api/articles/:article_id", updateVotes);

app.delete("/api/comments/:comment_id", deleteComment);

app.all("*", (req, res, next) => {
  res.status(404).send({ message: "Endpoint not found" });
});

app.use((err, req, res, next) => {
  if (err.status && err.message) {
    res.status(err.status).send({ message: err.message });
  } else {
    next(err);
  }
});

app.use((err, req, res, next) => {
  if (err.code === "23503") {
    res.status(404).send({ message: "not found" });
  } else {
    next(err);
  }
});

app.use((err, req, res, next) => {
  if (err.code === "22P02") {
    res.status(400).send({ message: "Bad request" });
  } else {
    next(err);
  }
});

app.use((err, req, res, next) => {
  if (err.code === "23502") {
    res.status(400).send({ message: "comment is empty" });
  } else {
    next(err);
  }
});

app.use((err, req, res, next) => {
  console.log(err);
  res.sendStatus(500);
});

module.exports = app;
