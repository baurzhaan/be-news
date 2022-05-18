const { selectTopics } = require('../models/topics.models');

exports.getTopics = (_, response, next) => {
  selectTopics()
    .then((topics) => {
      return response.status(200).send(topics);
    })
    .catch((error) => {
      next(error);
    });
};