const db = require('../db/connection.js');

exports.selectArticles = () => {
  const sqlQuery = 'SELECT articles.article_id, articles.author, articles.created_at, articles.title, articles.topic, articles.votes, COUNT(comments.article_id) comment_count FROM articles LEFT JOIN comments ON comments.article_id = articles.article_id GROUP BY articles.article_id ORDER BY created_at DESC;' 
  return db.query(sqlQuery)
  .then(({ rows: articleRows }) => {
    return articleRows;
  });
};

exports.selectArticleById = (articleId) => {
  const sqlQuery = 'SELECT articles.*, COUNT(comments.article_id) comment_count FROM articles LEFT JOIN comments ON comments.article_id = articles.article_id WHERE articles.article_id = $1 GROUP BY articles.article_id;';
  return db.query(sqlQuery, [articleId])
  .then(({ rows: articleRows }) => {
    if (articleRows.length) return articleRows[0];
    return Promise.reject({ code: 404, msg: 'Not found' });
  });
};

exports.updateArticleById = (articleId, { inc_votes }) => {
  const sqlQuery = 'UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING *';
  return db.query(sqlQuery, [inc_votes, articleId])
    .then(({ rows: articleRows }) => {
      if (articleRows.length) return articleRows[0];
      return Promise.reject({ code: 404, msg: 'Not found' });
    });
};