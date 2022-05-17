const { selectTopics, selectArticleById } = require('../models/news.models.js');

exports.getTopics = (request, response, next) => {
  selectTopics()
    .then((topics) => {
      return response.status(200).send(topics);
    })
    .catch((error) => {
      console.log(error, '<<< an error in getTopics controller/model');
      next(error);
    })
};

exports.getArticleById = (request, response, next) => {
  selectArticleById(request.params.article_id)
    .then((article) => {
      response.status(200).send(article);
    })
    .catch((error) => {
      console.log(error, '<<< an error in getArticleById controller/model');
      next(error);
    })
};