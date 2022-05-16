const express = require('express');
const getTopics = require('./controllers/topics.controllers.js');

const app = express();

app.get('/api/topics', getTopics);

app.use((error, request, response, next) => {
  console.log(error, '<<< caught an error in the last app.use');
  response.status(500).send('Server Error!');
});

module.exports = app;