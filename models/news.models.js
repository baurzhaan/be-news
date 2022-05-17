const db = require('../db/connection.js')

exports.selectTopics = () => {
  return db.query('SELECT * FROM topics')
    .then((topics) => {
      return topics.rows;
    })
    .catch((error) => {
      next(error);
    });
};

// exports.selectArticleById = (articleId) => {
//   console.log(articleId, '<<< article Id');
//   return db.query('SELECT * FROM articles WHERE ')
// }