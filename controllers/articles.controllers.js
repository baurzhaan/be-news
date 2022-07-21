const { selectArticles, selectArticleById, updateArticleById, insertArticle } = require('../models/articles.models');

exports.getArticles = (request, response, next) => {
  selectArticles(request.query)
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

exports.postArticle = (request, response, next) => {
  insertArticle(request.body)
  .then((insertedArticle) => {
    const timeOffset = insertedArticle.created_at.getTimezoneOffset() * 60000;
    insertedArticle.created_at = insertedArticle.created_at.getTime() - timeOffset;
    response.status(201).send(insertedArticle);
  })
}