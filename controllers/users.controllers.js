const { selectUsers } = require('../models/users.models.js');

exports.getUsers = (_, response, next) => {
  selectUsers()
    .then((users) => {
      return response.status(200).send(users);
    })
    .catch((error) => {
      next(error);
    });
};