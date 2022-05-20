const db = require('../db/connection.js');

exports.selectArticles = () => {
  const sqlQuery = 'SELECT articles.article_id, articles.author, articles.created_at, articles.title, articles.topic, articles.votes, COUNT(comments.article_id) comment_count FROM articles LEFT JOIN comments ON comments.article_id = articles.article_id GROUP BY articles.article_id ORDER BY created_at DESC;' 
  return db.query(sqlQuery)
  .then(({ rows: articleRows }) => {
    return articleRows;
  });
};

exports.selectArticleById = (articleId) => {
  
  if (isNaN(articleId)) {
    return Promise.reject({ code: 'articleIdisNaN'});
  } 
  
  const sqlQuery = 'SELECT articles.*, COUNT(comments.article_id) comment_count FROM articles LEFT JOIN comments ON comments.article_id = articles.article_id WHERE articles.article_id = $1 GROUP BY articles.article_id;';
  return db.query(sqlQuery, [articleId])
  .then(({ rows: articleRows }) => {
    if (articleRows.length) return articleRows[0];
    return Promise.reject({ code: 'articleNotFound'});
  })
  .catch((error) => { 
    if (error.code === 'articleNotFound') return Promise.reject({ code: 'articleNotFound'});
    return Promise.reject({ code: 'something wrong with above SQL - COUNT statement'});
  })
};

exports.updateArticleById = (articleId, { inc_votes }) => {
  if (isNaN(articleId)) {
    return Promise.reject({ code: 'articleIdisNaN'});
  }
  const sqlQuery = 'UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING *';
  return db.query(sqlQuery, [inc_votes, articleId])
    .then(({ rows: articleRows }) => {
      if (articleRows.length) return articleRows[0];
      return Promise.reject({ code: 'articleNotFound' });
    })
};