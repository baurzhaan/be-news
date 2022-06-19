const { selectUsers, selectUserByUsername } = require('../models/users.models.js');

exports.getUsers = (_, response, next) => {
  selectUsers()
    .then((users) => {
      return response.status(200).send(users);
    })
    .catch((error) => {
      next(error);
    });
};

exports.getUserByUsername = (request, response, next) => {
  selectUserByUsername(request.params.username)
    .then((user) => {
      return response.status(200).send(user);
    })
    .catch((error) => {
      next(error);
    });
};