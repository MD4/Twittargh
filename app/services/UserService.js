var async = require('async'),
    UserDao = require('../daos/UserDao'),
    WallDao = require('../daos/WallDao');

module.exports.findOne = function (username, callback) {
    UserDao.findOne(username, callback);
};

module.exports.follow = function (followerUsername, followedUsername, callback) {
    async.series([
        function (cb) {
            UserDao.follow(followerUsername, followedUsername, cb);
        },
        function (cb) {
            WallDao.appendTweets(followerUsername, followedUsername, cb);
        }
    ], function (err) {
        callback(err);
    });
};

module.exports.unfollow = function (followerUsername, followedUsername, callback) {
    async.series([
        function (cb) {
            UserDao.unfollow(followerUsername, followedUsername, cb);
        },
        function (cb) {
            WallDao.removeTweets(followerUsername, followedUsername, cb);
        }
    ], function (err) {
        callback(err);
    });
};

module.exports.getFollowers = function(username, callback) {
    UserDao.getFollowers(username, callback);
};

module.exports.getFollowing = function(username, callback) {
    UserDao.getFollowing(username, callback);
};