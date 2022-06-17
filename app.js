const express = require('express');
const cors = require('cors');
const apiRouter = require('./routes/api-router');

const app = express();

app.use(cors());
app.use(express.json());
app.use('/api', apiRouter);

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
    // case 'sqlSyntaxError': response.status(400).send({ msg: 'Invalid request: SQL syntax error' }); break;
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