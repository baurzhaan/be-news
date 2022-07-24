const { selectArticles, selectArticleById, updateArticleById, insertArticle } = require('../models/articles.models');

exports.getArticles = (request, response, next) => {
  // console.log(request.query.p, "<<< page in request");
  // console.log(request.query.limit, "<<< limit in request");
  const page = request.query.p ? request.query.p : 1;
  const limit = request.query.limit ? request.query.limit : 10;
  // console.log(page, "<<< page");
  // console.log(limit, "<<< limit");
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  // console.log(startIndex, "<<< startIndex");
  // console.log(endIndex, "<<< endIndex");
  selectArticles(request.query)
  .then((articleRows) => {
    articleRows.forEach(article => {
      const timeOffset = article.created_at.getTimezoneOffset() * 60000;
      article.created_at = article.created_at.getTime() - timeOffset;
      article.comment_count = +article.comment_count;
    });
    response.status(200).send(articleRows.slice(startIndex, endIndex));
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
    response.status(201).send(insertedArticle);
  })
  .catch((error) => {
    next(error);
  })
};
