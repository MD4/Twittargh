var async = require('async'),
    UserDao = require('../daos/UserDao');

module.exports.findOne = function (username, callback) {
    UserDao.findOne(username, callback);
};

module.exports.follow = function(followerUsername, followedUsername, callback) {
    UserDao.follow(followerUsername, followedUsername, callback);
};