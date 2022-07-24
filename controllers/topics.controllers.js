const { selectTopics, insertTopic } = require('../models/topics.models');

exports.getTopics = (request, response, next) => {
  selectTopics()
  .then((topics) => {
    return response.status(200).send(topics);
  })
  .catch((error) => {
    next(error);
  });
};

exports.postTopic = (request, response, next) => {
  insertTopic(request.body)
  .then((topic) => {
    return response.status(201).send(topic);
  })
  .catch((error) => {
    next(error);
  });
};