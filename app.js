const express = require('express');
const { getTopics, getArticleById } = require('./controllers/news.controllers.js');

const app = express();

app.get('/api/topics', getTopics);
// app.get('/api/articles/:article_id', getArticleById);

app.all('/*', (request, response) => {
  response.status(404).send({ msg: 'Route not found' });
});

app.use((error, request, response) => {
  console.log(error, '<<< caught error in the last app.use');
response.status(500).send({ msg: 'Server Error!' });
});

module.exports = app;