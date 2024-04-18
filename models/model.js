const db = require("../db/connection");

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

exports.getCorrectArticle = (id) => {
  return db
    .query(
      `
  SELECT * FROM articles
  WHERE article_id = $1`,
      [id]
    )
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, message: "article not found" });
      }
      return rows;
    });
};
