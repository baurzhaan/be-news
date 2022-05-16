const express = require('express');
const getTopics = require('./controllers/topics.controllers.js');

const app = express();

console.log('I am an app');

app.get('/api/topics', getTopics);

module.exports = app;