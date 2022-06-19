const db = require('../db/connection.js')

exports.selectUsers = () => {
  return db.query('SELECT * FROM users')
    .then(({ rows }) => {
      return rows;
    });
};

exports.selectUserByUsername = (username, next) => {
  const sqlQuery = 'SELECT  * FROM users WHERE username = $1;';
  return db.query(sqlQuery, [username])
  .then(({ rows: user }) => {
    if (user.length) return user[0];
    return Promise.reject({ code: 'userNotFound'});
  })
  .catch((error) => {
    if (error.code === 'userNotFound') return Promise.reject({ code: 'userNotFound'});
    next(error);
  })
};