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

exports.getArticles = () => {
  return db
    .query(
      `
      SELECT articles.*, COUNT(comments.article_id)::INT AS comment_count
      FROM articles
      LEFT JOIN comments ON articles.article_id = comments.article_id
      GROUP BY articles.article_id;
    `
    )
    .then(({ rows }) => {
      return rows;
    });
};

exports.getComments = (id) => {
  return db
    .query(
      `
  SELECT * FROM comments
  WHERE article_id = $1
  `,
      [id]
    )
    .then(({ rows }) => {
      return rows;
    });
};
