const db = require('../db/connection.js')

exports.selectTopics = () => {
  return db.query('SELECT * FROM topics')
    .then(({ rows }) => {
      return rows;
    });
};

// exports.selectArticleById = (articleId) => {
//   return db.query('SELECT * FROM articles WHERE article_id = $1', [articleId])
//   .then(({ rows }) => {
//     return rows[0];
//   });
// };