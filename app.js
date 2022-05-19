const express = require('express');
const { getTopics } = require('./controllers/topics.controllers');
const { getArticles, getArticleById, patchArticleById } = require('./controllers/articles.controllers');
const { getUsers } = require('./controllers/users.controllers');
const { getCommentsByArticleId, postCommentByArticleId } = require('./controllers/comments.controllers')

const app = express();
app.use(express.json());

app.get('/api/articles', getArticles);
app.get('/api/topics', getTopics);
app.get('/api/users', getUsers);

app.get('/api/articles/:article_id', getArticleById);
app.get('/api/articles/:article_id/comments', getCommentsByArticleId)
app.patch('/api/articles/:article_id', patchArticleById);
app.post('/api/articles/:article_id/comments', postCommentByArticleId);

app.all('/*', (_request, response) => {
  response.status(404).send({ msg: 'Route not found' });
});

app.use((error, _request, response, next) => {
  if (error.code === '22P02') {
    response.status(400).send({ msg: 'Invalid request' });
  } else {
    next(error);
  };
});

app.use((error, _request, response, next) => {
  if (error.code === '23502') {
    response.status(404).send({ msg: 'Not found' });
  } else {
    next(error);
  };
});

app.use((error, _request, response, next) => {
  response.status(error.code).send({ 
    error: error.code,
    msg: error.msg 
  });
});

module.exports = app;