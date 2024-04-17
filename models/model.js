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
