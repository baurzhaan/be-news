const db = require('../db/connection.js')

function selectTopics() {
  return db.query('SELECT * from topics')
    .then((topics) => {
      return topics.rows;
    })
    .catch((error) => {
      next(error);
    });
};

module.exports = selectTopics;