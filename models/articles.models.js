const db = require('../db/connection.js');

exports.selectArticleById = (articleId) => {
  return db.query('SELECT * FROM articles WHERE article_id = $1;', [articleId])
  .then(({ rows }) => {
    if (rows.length) return rows[0];
    return Promise.reject({ code: 404, msg: 'The article not found' });
  });
};

exports.updateArticleById = (articleId, { inc_votes }) => {
  return db.query('UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING *', [inc_votes, articleId])
    .then(({ rows }) => {
      if (!rows.length) return Promise.reject({ code: 404, msg: 'The article not found' });
      return rows[0];
    });
}