// const { promises } = require("supertest/lib/test");
const db = require("../db/connection");
// const format = require("pg-format");

exports.getTopicData = () => {
  return db
    .query(
      `
    SELECT * FROM topics`
    )
    .then(({ rows }) => {
      return rows;
    });
};

// function getTopics(req, res, next) {}
