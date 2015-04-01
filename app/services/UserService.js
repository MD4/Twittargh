var Async = require('async'),
    UserDao = require('../daos/UserDao');

module.exports.findOne = function (username, callback) {
    UserDao.findOne(username, callback);
};