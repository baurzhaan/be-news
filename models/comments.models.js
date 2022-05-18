const db = require('../db/connection.js');

exports.selectCommentsByArticleId = (articleId) => {
  const sqlQuery = 'SELECT comment_id, body, author, votes, created_at FROM comments WHERE article_id = $1';
  return db.query(sqlQuery, [articleId])
  .then(({ rows: commentsRows }) => {
    if (commentsRows.length > 0) return commentsRows;
    return Promise.reject({ code: 404, msg: 'The article not found' });
  });
};