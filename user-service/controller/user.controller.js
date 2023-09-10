const db = require('../model');
const User = db.users;

exports.create = (req, res) => {
  if (!req.body.username || !req.body.password) {
    res.status(400).send({message: 'Username and password required.'});
    return;
  }

  const user = new User({
    username: req.body.username,
    password: req.body.password
  });

  user
    .save(user)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || 'An error occured while creating the User.'
      })
    })
};

exports.findOne = (req, res) => {
  const username = req.query.username;
  var condition = username ? { username: username } : {};

  User.find(condition)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || 'An error occured while retrieving the user.'
      })
    });
};

exports.update = (req, res) => {
  if (!req.body) {
    return res.status(400).send({
      message: 'Details required to update.'
    });
  }

  const username = req.query.username;
  var condition = username ? { username: username } : {};

  User.findOneAndUpdate(condition, req.body, { new: true })
    .then(data => {
      if (!data) {
        res.status(404).send({
          message: `Unable to update User with username ${username}. Not found.`
        });
      }
      res.send({ message: 'User updated successfully.'});
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || `Error updating User with username ${username}.`
      });
    });
};

exports.delete = (req, res) => {
  if (!req.body) {
    return res.status(400).send({
      message: 'Details required to delete.'
    });
  }

  const username = req.query.username;
  var condition = username ? { username: username } : {};

  User.findOneAndDelete(condition, req.body, { new: true })
    .then(data => {
      if (!data) {
        res.status(404).send({
          message: `Unable to delete User with username ${username}. Not found.`
        });
      }
      res.send({ message: 'User deleted successfully.'});
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || `Error deleting User with username ${username}.`
      });
    });
};

exports.deleteAll = (req, res) => {
  User.deleteMany({})
    .then(data => {
      res.send({ message: `${data.deletedCount} Users delete successfully.`});
    })
    .catch(err =>{
      res.status(500).send({
        message: err.message || 'Error deleting all users.'
      });
    });
};
