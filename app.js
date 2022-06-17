const express = require('express');
const cors = require('cors');
const apiRouter = require('./routes/api-router');
const { errorHandler } = require('./errors');

const app = express();

app.use(cors());
app.use(express.json());
app.use('/api', apiRouter);

app.all('/*', (_request, response) => {
  response.status(404).send({ msg: 'Route not found' });
});

app.use(errorHandler);

app.use((error, _request, response) => { // default
  response.status(500).send({ 
    code: error.statusCode,
    msg: error.statusMessage
  });
});

module.exports = app;