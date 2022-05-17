const db = require('../db/connection.js')

exports.selectTopics = () => {
  return db.query('SELECT * FROM topics')
    .then(({ rows }) => {
      return rows;
    });
};

exports.selectArticleById = (articleId) => {
  const sqlString = 'SELECT * FROM articles WHERE article_id = $1;';
  return db.query(sqlString, [articleId])
  .then(({ rows }) => {
    if (rows.length) return rows[0];
    return Promise.reject({ code: 404, msg: 'The article not found'});
  });
};