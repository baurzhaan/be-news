const { selectCommentsByArticleId, insertCommentByArticleId, deleleComment, updateCommentById } = require('../models/comments.models')

exports.getCommentsByArticleId = (request, response, next) => {
  selectCommentsByArticleId(request.params.article_id)
  .then((comments) => {
    comments.forEach(comment => {
      const timeOffset = comment.created_at.getTimezoneOffset() * 60000;
      comment.created_at = comment.created_at.getTime() - timeOffset;
    });
    response.status(200).send(comments);
  })
  .catch((error) => {
    next(error);
  });
};

exports.postCommentByArticleId = (request, response, next) => {
  insertCommentByArticleId(request.params.article_id, request.body)
  .then((insertedComment) => {
    response.status(201).send(insertedComment);
  })
  .catch((error) => {
    next(error);
  });
};

exports.deleteCommentById = (request, response, next) => {
  deleleComment(request.params.comment_id)
  .then(() => {
    response.status(204).send();
  })
  .catch((error) => {
    next(error);
  });
};

exports.patchCommentById = (request, response, next) => {
  updateCommentById(request.params.comment_id, request.body)
    .then((updatedComment) => {
      response.status(201).send(updatedComment);
    })
    .catch((error) => {
      console.log("I am here");
      next(error);
    });
};