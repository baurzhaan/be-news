const express = require('express');
const cors = require('cors');

const { getTopics } = require('./controllers/topics.controllers');
const { getArticles, getArticleById, patchArticleById } = require('./controllers/articles.controllers');
const { getUsers } = require('./controllers/users.controllers');
const { getCommentsByArticleId, postCommentByArticleId, deleteCommentById } = require('./controllers/comments.controllers')
const { getApi } = require('./controllers/get-api.controller')

const app = express();

app.use(cors());
app.use(express.json());

app.get('/api', getApi);
app.get('/api/topics', getTopics);
app.get('/api/users', getUsers);
app.get('/api/articles/:article_id', getArticleById);
app.get('/api/articles/:article_id/comments', getCommentsByArticleId)
app.patch('/api/articles/:article_id', patchArticleById);
app.post('/api/articles/:article_id/comments', postCommentByArticleId);
app.get('/api/articles', getArticles);
app.delete('/api/comments/:comment_id', deleteCommentById);
app.all('/*', (_request, response) => {
  response.status(404).send({ msg: 'Route not found' });
});

app.use((error, _request, response, next) => {
  switch (error.code) {
    case 'articleIdisNaN': response.status(400).send({ msg: 'Invalid article ID: not a number' }); break;
    case 'missingProperty': response.status(400).send({ msg: 'Invalid request: missing property' }); break;
    case 'articleNotFound': response.status(404).send({ msg: 'Article not found' }); break;
    case 'authorNotFound': response.status(404).send({ msg: 'Author not found' }); break;
    case 'sqlUndefinedColumn': response.status(400).send({ msg: 'Invalid request: invalid column to sort by' }); break;
    case 'sqlSyntaxError': response.status(400).send({ msg: 'Invalid request: SQL syntax error' }); break;
    case 'commentNotFound': response.status(404).send({ msg: 'Comment not found' }); break;
    case 'commentIdNotValid': response.status(400).send({ msg: 'Invalid request: comment ID is not valid' }); break;
    default: next(error);
  };
});

app.use((error, _request, response) => { // default
  response.status(500).send({ 
    code: error.statusCode,
    msg: error.statusMessage
  });
});

module.exports = app;




// app.use((error, _request, response, next) => { // articleIdisNaN
//   if (error.code === 'articleIdisNaN') {
//     response.status(400).send({ msg: 'Invalid article ID: not a number' });
//   } else {
//     next(error);
//   }
// })

// app.use((error, _request, response, next) => { // missingProperty
//   if (error.code === 'missingProperty') {
//     response.status(400).send({ msg: 'Invalid request: missing property' });
//   } else {
//     next(error);
//   }
// })

// app.use((error, _request, response, next) => { // articleNotFound
//   if (error.code === 'articleNotFound') {
//     response.status(404).send({ msg: 'Article not found' });
//   } else {
//     next(error);
//   }
// })

// app.use((error, _request, response, next) => { // authorNotFound
//   if (error.code === 'authorNotFound') {
//     response.status(404).send({ msg: 'Author not found' });
//   } else {
//     next(error);
//   }
// })

// app.use((error, _request, response, next) => { // SQL error: column doesn't exist
//   if (error.code === 'sqlUndefinedColumn') {
//     response.status(400).send({ msg: 'Invalid request: invalid column to sort by' });
//   } else {
//     next(error);
//   };
// })

// app.use((error, _request, response, next) => { // SQL error: column doesn't exist
//   if (error.code === 'sqlSyntaxError') {
//     response.status(400).send({ msg: 'Invalid request: SQL syntax error' });
//   } else {
//     next(error);
//   };
// });

// app.use((error, _request, response, next) => { // comment not found
//   if (error.code === 'commentNotFound') {
//     response.status(404).send({ msg: 'Comment not found' });
//   } else {
//     next(error);
//   };
// });

// app.use((error, _request, response, next) => { // invalid comment ID
//   if (error.code === 'commentIdNotValid') { 
//     response.status(400).send({ msg: 'Invalid request: comment ID is not valid' });
//   } else {
//     next(error);
//   };
// });

// app.use((error, _request, response) => { // default
//   response.status(error.code).send({ 
//     error: error.code,
//     msg: error.msg 
//   });
// });

// module.exports = app;