const db = require('../db/connection.js')

exports.selectTopics = () => {
  return db.query('SELECT * FROM topics')
    .then(({ rows }) => {
      return rows;
    });
};

exports.selectArticleById = (articleId) => {
  return db.query('SELECT * FROM articles WHERE article_id = $1;', [articleId])
  .then(({ rows }) => {
    if (rows.length) return rows[0];
    return Promise.reject({ code: 404, msg: 'The article not found' });
  });
};

exports.updateArticleById = (articleId, incVote) => {
  return db.query('SELECT votes FROM articles WHERE article_id = $1;', [articleId])
  .then(({ rows }) => {
    if (!rows.length) return Promise.reject({ code: 404, msg: 'The article not found' });
    return db.query('UPDATE articles SET votes = $1 WHERE article_id = $2 RETURNING *', [rows[0].votes + incVote.inc_votes, articleId])
    .then(({ rows }) => {
      return rows[0];
    });
  });
}