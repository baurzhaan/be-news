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
  const dateObject = new Date(Date.now());
  const sqlQuery = 'INSERT INTO comments (body, article_id, author, votes, created_at) VALUES ($1, $2, $3, $4, $5) RETURNING *';
  return db.query(sqlQuery, [comment.body, +articleId, comment.username, 0, dateObject.toISOString()])
  .then(( {rows: insertedComment} ) => {
    if (insertedComment.length > 0) {
      insertedComment[0].created_at = insertedComment[0].created_at.getTime();
      return insertedComment[0];
    };
    return Promise.reject({ code: 404, msg: 'Not found' });
  })
};

// console.log(currentDate, typeof currentDate, '<<< Number, in milliseconds');
// console.log(dateObject, typeof(dateObject), '<<< object Date.now()');
// console.log(dateObject.getTime(), typeof dateObject.getTime(), '<<< getTime');
// console.log(dateObject.toTimeString());
// console.log(dateObject.toUTCString());
// console.log(dateObject.toISOString(), '<<<');
// console.log(dateObject.toString());