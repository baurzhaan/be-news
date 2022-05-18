const db = require('../db/connection.js');

exports.selectArticleById = (articleId) => {
  return db.query('SELECT articles.*, COUNT(comments.article_id) comment_count FROM articles LEFT JOIN comments ON comments.article_id = articles.article_id WHERE articles.article_id = $1 GROUP BY articles.article_id;', [articleId])
  .then(({ rows: articleRows }) => {
    if (articleRows.length) {
      articleRows[0].comment_count = +articleRows[0].comment_count;
      return articleRows[0];
    };
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