const app = require("../app");
const {
  getTopicData,
  getCorrectArticle,
  getArticles,
  getComments,
  insertComment,
  updateArticleVotes,
  deleteCommentById,
  getAllUsers,
} = require("../models/model");
const endpoints = require("../endpoints.json");

exports.getHealthCheck = (req, res, next) => {
  res.status(200).send({ msg: "Server online" });
};

exports.getTopics = (req, res, next) => {
  return getTopicData()
    .then((topics) => {
      res.status(200).send({ topics });
    })
    .catch(next);
};

exports.getEndpoints = (req, res, next) => {
  res.status(200).send({ endpoints });
};

exports.getArticleId = (req, res, next) => {
  const id = req.params.article_id;
  getCorrectArticle(id)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch(next);
};

exports.getAllArticles = (req, res, next) => {
  const { topic } = req.query;
  getArticles(topic)
    .then((articles) => {
      res.status(200).send({ articles });
    })
    .catch(next);
};

exports.getCommentsById = (req, res, next) => {
  const id = req.params.article_id;
  getComments(id)
    .then((comments) => {
      res.status(200).send({ comments });
    })
    .catch(next);
};

exports.postNewComment = (req, res, next) => {
  const comment = req.body;
  const id = req.params.article_id;
  if (!comment.body) {
    res.status(400).send({ message: "comment is empty" });
  }
  insertComment(comment, id)
    .then((comment) => {
      res.status(201).send({ comment });
    })
    .catch(next);
};

exports.updateVotes = (req, res, next) => {
  const votes = req.body.inc_votes;
  const id = req.params.article_id;
  updateArticleVotes(votes, id)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch(next);
};

exports.deleteComment = (req, res, next) => {
  const commentId = req.params.comment_id;
  deleteCommentById(commentId)
    .then(() => {
      res.sendStatus(204);
    })
    .catch(next);
};

exports.getUsers = (req, res, next) => {
  getAllUsers()
    .then((users) => {
      res.status(200).send({ users });
    })
    .catch(next);
};
