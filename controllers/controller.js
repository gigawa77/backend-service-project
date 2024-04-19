const app = require("../app");
const {
  getTopicData,
  getCorrectArticle,
  getArticles,
  getComments,
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
  getArticles().then((articles) => {
    res.status(200).send({ articles });
  });
};

exports.getCommentsById = (req, res, next) => {
  const id = req.params.article_id;
  getComments(id)
    .then((comments) => {
      res.status(200).send({ comments });
    })
    .catch(next);
};
