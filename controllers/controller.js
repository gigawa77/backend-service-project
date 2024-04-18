const app = require("../app");
const { getTopicData, getCorrectArticle } = require("../models/model");
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
