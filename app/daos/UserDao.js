var async = require('async'),
    redis = require('../utils/helpers/RedisHelper'),
    Errors = require('../utils/errors/Errors');

var userPath = module.exports.path = ["users"];
var userFollowersPath = module.exports.followersPath = ["users", "followers"];
var userFollowingPath = module.exports.followingPath = ["users", "following"];

module.exports.findOne = function (username, callback) {
    async.waterfall([
        function (cb) {
            redis.hgetall(
                redis.getKey(userPath, username),
                function (err, user) {
                    if (err) {
                        return cb(new Errors.InternalError());
                    }
                    if (!user) {
                        return cb(new Errors.NotFoundError());
                    }
                    cb(null, user);
                }
            );
        },
        function (user, cb) {
            this.getFollowers(username, function(err, followers) {
                user.followers = followers;
                cb(err, user);
            });
        }.bind(this),
        function (user, cb) {
            this.getFollowing(username, function(err, following) {
                user.following = following;
                cb(err, user);
            });
        }.bind(this)
    ], function (err, user) {
        user.username = username;
        callback(err, user);
    });
};

module.exports.follow = function (followerUsername, followedUsername, callback) {
    if (!followerUsername || !followedUsername || followerUsername === followedUsername)
        return callback(new Errors.BadRequestError());

    async.series([
        function (cb) {
            redis.sadd(
                redis.getKey(userFollowersPath, followedUsername),
                followerUsername,
                function (err) {
                    cb(err ? new Errors.InternalError() : null);
                }
            );
        },
        function (cb) {
            redis.sadd(
                redis.getKey(userFollowingPath, followerUsername),
                followedUsername,
                function (err) {
                    cb(err ? new Errors.InternalError() : null);
                }
            );
        }
    ], function (err) {
        callback(err);
    });
};

module.exports.unfollow = function (followerUsername, followedUsername, callback) {
    if (!followerUsername || !followedUsername || followerUsername === followedUsername)
        return callback(new Errors.BadRequestError());

    async.series([
        function (cb) {
            redis.srem(
                redis.getKey(userFollowersPath, followedUsername),
                followerUsername,
                function (err) {
                    cb(err ? new Errors.InternalError() : null);
                }
            );
        },
        function (cb) {
            redis.srem(
                redis.getKey(userFollowingPath, followerUsername),
                followedUsername,
                function (err) {
                    cb(err ? new Errors.InternalError() : null);
                }
            );
        }
    ], function (err) {
        callback(err);
    });
};

module.exports.getFollowing = function(username, callback) {
    if (!username)
        return callback(new Errors.BadRequestError());

    redis.smembers(
        redis.getKey(userFollowingPath, username),
        function (err, following) {
            if (err) {
                return cb(new Errors.InternalError());
            }
            callback(null, following);
        }
    );
};

module.exports.getFollowers = function(username, callback) {
    if (!username)
        return callback(new Errors.BadRequestError());

    redis.smembers(
        redis.getKey(userFollowersPath, username),
        function (err, followers) {
            if (err) {
                return cb(new Errors.InternalError());
            }
            callback(null, followers);
        }
    );
};