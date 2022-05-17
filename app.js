const express = require('express');
const { getTopics, getArticleById } = require('./controllers/news.controllers.js');

const app = express();

app.get('/api/topics', getTopics);

// app.get('/api/articles/:article_id', getArticleById);

app.use((error, request, response, next) => {
  console.log(error, '<<< caught an error in the last app.use');
  response.status(500).send('Server Error!');
});

module.exports = app;