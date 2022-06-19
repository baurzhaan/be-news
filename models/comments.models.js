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
      switch (error.code) {
        case '23503':
          if (error.detail.startsWith('Key (article_id)')) return Promise.reject({ code: 'articleNotFound'});
          if (error.detail.startsWith('Key (author)')) return Promise.reject({ code: 'authorNotFound'});
      };
    })
  } else {
    return Promise.reject({ code: 'missingProperty' });
  };
};

exports.deleleComment = (comment_id) => {
  sqlQuery = 'DELETE FROM comments WHERE comment_id = $1';
  return db.query(sqlQuery, [comment_id])
  .then(({ rowCount }) => {
    if (rowCount === 0) return Promise.reject({ code : 'commentNotFound' })
  })
  .catch((error) => {
    switch (error.code) {
      case '22P02': return Promise.reject({ code : 'commentIdNotValid' });
      case 'commentNotFound': return Promise.reject({ code : 'commentNotFound' });
      default: next(error);
    };
  });
};

exports.updateCommentById = (commentId, { inc_votes }) => {
  if (isNaN(commentId)) {
    return Promise.reject({ code: 'commentIdisNaN'});
  };
  const sqlQuery = 'UPDATE comments SET votes = votes + $1 WHERE comment_id = $2 RETURNING *';
  return db.query(sqlQuery, [inc_votes, commentId])
    .then(({ rows: commentRows }) => {
      if (commentRows.length) return commentRows[0];
      return Promise.reject({ code: 'commentNotFound' });
    })
};