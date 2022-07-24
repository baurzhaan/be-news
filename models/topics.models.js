const db = require('../db/connection.js');

exports.selectTopics = () => {
  return db.query('SELECT * FROM topics')
    .then(({ rows }) => {
      return rows;
    });
};

exports.insertTopic = (topic) => {
  const sqlQuery = 'INSERT INTO topics (slug, description) VALUES ($1, $2) RETURNING *';
  return db.query(sqlQuery, [topic.slug, topic.description])
  .then(({ rows: insertedTopic }) => {
    return insertedTopic[0];
  })
  .catch((error) => {
    console.log(error, "<<< error in insertTopic");
  })
};
