const { selectArticles, selectArticleById, updateArticleById } = require('../models/articles.models');

exports.getArticles = (_, response, next) => {
  selectArticles()
  .then((articleRows) => {
    articleRows.forEach(article => {
      const timeOffset = article.created_at.getTimezoneOffset() * 60000;
      article.created_at = article.created_at.getTime() - timeOffset;
      article.comment_count = +article.comment_count;
    });
    response.status(200).send(articleRows);
  })
  .catch((error) => {
    next(error);
  })
};

exports.getArticleById = (request, response, next) => {
  selectArticleById(request.params.article_id)
    .then((article) => {
      const timeOffset = article.created_at.getTimezoneOffset() * 60000;
      article.created_at = article.created_at.getTime() - timeOffset;
      article.comment_count = +article.comment_count;
      response.status(200).send(article);
    })
    .catch((error) => {
      next(error);
    });
};

exports.patchArticleById = (request, response, next) => {
  updateArticleById(request.params.article_id, request.body)
    .then((updatedArticle) => {
      const timeOffset = updatedArticle.created_at.getTimezoneOffset() * 60000;
      updatedArticle.created_at = updatedArticle.created_at.getTime() - timeOffset;
      response.status(201).send(updatedArticle);
    })
    .catch((error) => {
      next(error);
    });
};