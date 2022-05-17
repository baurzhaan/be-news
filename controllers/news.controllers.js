const { selectTopics, selectArticleById } = require('../models/news.models.js');

exports.getTopics = (request, response, next) => {
  selectTopics()
    .then((topics) => {
      return response.status(200).send(topics);
    })
    .catch((error) => {
      console.log(error, '<<< error in controller or model');
      next(error);
    })
};

// exports.getArticleById = (request, response, next) => {
//   selectArticleById(request.params.article_id)
//     .then((article) => {
//       response.status(200).send(article);
//     });
// };