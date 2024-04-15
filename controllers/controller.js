const app = require("../app");
const { getTopicData } = require("../models/model");
// const fs = require("fs/promises");

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

// module.exports = getHealthCheck;
