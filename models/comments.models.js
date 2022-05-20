const db = require('../db/connection.js');

exports.selectCommentsByArticleId = (articleId) => {
  const sqlQuery = 'SELECT comment_id, body, author, votes, created_at FROM comments WHERE article_id = $1';
  return db.query(sqlQuery, [articleId])
  .then(({ rows: commentsRows }) => {
    if (commentsRows.length > 0) return commentsRows;
    return Promise.reject({ code: 'articleNotFound' });
  });
};

exports.insertCommentByArticleId = (articleId, comment) => {
  if (isNaN(articleId)) {
    return Promise.reject({ code: 'articleIdisNaN'});
  } 

  if (Object.keys(comment).includes('username') && Object.keys(comment).includes('body')) {
    const sqlQuery = 'INSERT INTO comments (body, article_id, author) VALUES ($1, $2, $3) RETURNING *';
    return db.query(sqlQuery, [comment.body, articleId, comment.username])
    .then(( {rows: insertedComment} ) => {
      if (insertedComment.length > 0) {
        return insertedComment[0];
      };
    return Promise.reject({ code: 'articleNotFound'});
    })
    .catch((error) => {
      if (error.code = '23503') {
        if (error.detail.startsWith('Key (article_id)')) return Promise.reject({ code: 'articleNotFound'});
        if (error.detail.startsWith('Key (author)')) return Promise.reject({ code: 'authorNotFound'});
      };
    })
  } else {
    return Promise.reject({ code: 'missingProperty'});
  };
};