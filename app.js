const express = require('express');
const { getTopics, getArticleById } = require('./controllers/news.controllers.js');

const app = express();

app.get('/api/topics', getTopics);
app.get('/api/articles/:article_id', getArticleById);

app.all('/*', (request, response) => {
  response.status(404).send({ msg: 'Route not found' });
});

app.use((error, request, response, next) => {
  if (error.code === 404 && error.msg === 'The article not found') {
    console.log('article not found error message in app.use');
    response.status(error.code).send({ msg: error.msg });
  } else {
    next(error);
  }
})

app.use((error, request, response) => {
  console.log(error, '<<< an error in the last app.use');
response.status(500).send({ msg: 'Server Error!' });
});

module.exports = app;