const express = require('express');
const { getTopics } = require('./controllers/topics.controllers');
const { getArticles, getArticleById, patchArticleById } = require('./controllers/articles.controllers');
const { getUsers } = require('./controllers/users.controllers');
const { getCommentsByArticleId, postCommentByArticleId } = require('./controllers/comments.controllers')

const app = express();
app.use(express.json());


app.get('/api/topics', getTopics);
app.get('/api/users', getUsers);

app.get('/api/articles/:article_id', getArticleById);
app.get('/api/articles/:article_id/comments', getCommentsByArticleId)
app.patch('/api/articles/:article_id', patchArticleById);
app.post('/api/articles/:article_id/comments', postCommentByArticleId);
app.get('/api/articles', getArticles);

app.all('/*', (_request, response) => {
  response.status(404).send({ msg: 'Route not found' });
});

app.use((error, _request, response, next) => {
  if (error.code === 'articleIdisNaN') {
    response.status(400).send({ msg: 'Invalid article ID: not a number' });
  } else {
    next(error);
  }
})

app.use((error, _request, response, next) => {
  if (error.code === 'missingProperty') {
    response.status(400).send({ msg: 'Invalid request: missing property' });
  } else {
    next(error);
  }
})

app.use((error, _request, response, next) => {
  if (error.code === 'articleNotFound') {
    response.status(404).send({ msg: 'Article not found' });
  } else {
    next(error);
  }
})

app.use((error, _request, response, next) => {
  if (error.code === 'authorNotFound') {
    response.status(404).send({ msg: 'Author not found' });
  } else {
    next(error);
  }
})

app.use((error, _request, response) => {
  response.status(error.code).send({ 
    error: error.code,
    msg: error.msg 
  });
});

module.exports = app;