var Async = require('async'),
    UserDao = require('../daos/UserDao');

module.exports.find = function (username, callback) {
    UserDao.find(username, callback);
};