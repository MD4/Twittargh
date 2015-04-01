var async = require('async'),
    redis = require('../utils/helpers/RedisHelper'),
    Errors = require('../utils/errors/Errors');

var userPath = module.exports.path = ["users"];
var userFollowersPath = module.exports.path = ["users", "followers"];
var userFollowingPath = module.exports.path = ["users", "following"];

module.exports.findOne = function (username, callback) {
    async.waterfall([
        function (cb) {
            redis.hgetall(redis.getKey(userPath, username), cb);
        },
        function (user, cb) {
            redis.smembers(redis.getKey(userFollowingPath, username), function(err, following) {
                user.following = following;
                cb(err, user);
            });
        },
        function (user, cb) {
            redis.smembers(redis.getKey(userFollowersPath, username), function(err, followers) {
                user.followers = followers;
                cb(err, user);
            });
        }
    ], function (err, user) {
        callback(err, user);
    });
};

module.exports.follow = function (followerUsername, followedUsername, callback) {
    if (!followerUsername || !followedUsername || followerUsername === followedUsername)
        return callback(new Errors.BadRequestError());
    async.series([
        function (cb) {
            redis.sadd(redis.getKey(userFollowersPath, followedUsername), followerUsername, cb);
        },
        function (cb) {
            redis.sadd(redis.getKey(userFollowingPath, followerUsername), followedUsername, cb);
        },
    ], function (err) {
        callback(err, null);
    });
};