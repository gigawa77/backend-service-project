const db = require("../db/connection");
const { commentData } = require("../db/data/test-data");

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
  ORDER BY created_at DESC
  `,
      [id]
    )
    .then(({ rows }) => {
      return rows;
    });
};

exports.insertComment = (comment, id) => {
  comment.article_id = id;
  return db
    .query(
      `
      INSERT INTO comments 
      (author, body, article_id)
      VALUES
      ($1, $2, $3)
      RETURNING *;
      `,
      [comment.username, comment.body, comment.article_id]
    )
    .then(({ rows }) => {
      return rows[0];
    });
};

exports.updateArticleVotes = (votes, id) => {
  return db
    .query(
      `
    UPDATE articles
    SET votes = votes + $1
    WHERE article_id = $2
    RETURNING*;
    `,
      [votes, id]
    )
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, message: "article not found" });
      }
      return rows[0];
    });
};

exports.deleteCommentById = (commentId) => {
  return db
    .query(
      `
    DELETE FROM comments
    WHERE comment_id = $1
    RETURNING*;
    `,
      [commentId]
    )
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, message: "comment not found" });
      }
      return rows[0];
    });
};

exports.getAllUsers = () => {
  return db
    .query(
      `
    SELECT * FROM users
    `
    )
    .then(({ rows }) => {
      return rows;
    });
};
