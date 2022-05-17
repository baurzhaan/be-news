const express = require('express');
const { getTopics, getArticleById, patchArticleById } = require('./controllers/news.controllers.js');

const app = express();
app.use(express.json());

app.get('/api/topics', getTopics);
app.get('/api/articles/:article_id', getArticleById);
app.patch('/api/articles/:article_id', patchArticleById);

app.all('/*', (_, response) => {
  response.status(404).send({ msg: 'Route not found' });
});

app.use((error, _, response, next) => {
  if (error.code === '22P02') {
    response.status(400).send({ msg: 'Not valid request' });
  } else {
    next(error);
  }
})

app.use((error, _, response, next) => {
  if (error.code === 404 && error.msg === 'The article not found') {
    response.status(error.code).send({ msg: error.msg });
  } else {
    next(error);
  }
})

app.use((error, _, response) => {
  response.status(500).send({ msg: 'Server Error!' });
});

module.exports = app;