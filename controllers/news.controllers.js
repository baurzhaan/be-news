const { selectTopics, selectArticleById } = require('../models/news.models.js');

exports.getTopics = (request, response, next) => {
  selectTopics()
    .then((topics) => {
      return response.status(200).send(topics);
    })
    .catch((error) => {
      next(error);
    });
};

// exports.getArticleById = (request, response, next) => {
//   console.log(request.params.article_id, '<<< request');
//   selectArticleById(request.params.article_id)
//     .then((article) => {
//       console.log(article, '<<< article');
//     })
//     .catch((error) => {
//       next(error);
//     })
// }