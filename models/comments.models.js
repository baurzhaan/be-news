const db = require('../db/connection.js');

exports.selectCommentsByArticleId = (articleId) => {
  const sqlQuery = 'SELECT comment_id, body, author, votes, created_at FROM comments WHERE article_id = $1';
  return db.query(sqlQuery, [articleId])
  .then(({ rows: commentsRows }) => {
    if (commentsRows.length > 0) return commentsRows;
    return Promise.reject({ code: 404, msg: 'Not found' });
  });
};

exports.insertCommentByArticleId = (articleId, comment) => {
  // const dateObject = new Date(Date.now());
  const sqlQuery = 'INSERT INTO comments (body, article_id, author) VALUES ($1, $2, $3) RETURNING *';
  return db.query(sqlQuery, [comment.body, +articleId, comment.username])
  .then(( {rows: insertedComment} ) => {
    if (insertedComment.length > 0) {
      // insertedComment[0].created_at = insertedComment[0].created_at.getTime();
      console.log(insertedComment[0]);
      return insertedComment[0];
    };
    return Promise.reject({ code: 404, msg: 'Not found' });
  })
};