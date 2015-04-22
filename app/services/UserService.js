var async = require('async'),
    UserDao = require('../daos/UserDao'),
    WallDao = require('../daos/WallDao');

/**
 * Find a user by its username
 * @param username User username
 * @param callback
 */
module.exports.findOne = function (username, callback) {
    UserDao.findOne(username, callback);
};

/**
 * Make a given user follow another user
 * @param followerUsername Follower username
 * @param followedUsername Followed username
 * @param callback
 */
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

/**
 * Make a given unfollow another user
 * @param followerUsername Follower username
 * @param followedUsername Followed username
 * @param callback
 */
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

/**
 * Get every user which follows a given user
 * @param username User username
 * @param callback
 */
module.exports.getFollowers = function(username, callback) {
    UserDao.getFollowers(username, callback);
};

/**
 * Get every user which a given follow
 * @param username User username
 * @param callback
 */
module.exports.getFollowing = function(username, callback) {
    UserDao.getFollowing(username, callback);
};