var async = require('async'),
    redis = require('../utils/helpers/RedisHelper'),
    Errors = require('../utils/errors/Errors'),
    TweetDao = require('../daos/TweetDao');

var userWallPath = module.exports.wallPath = ["users", "walls"];

module.exports.getWall = function (username, callback, start, end) {
    if (!username)
        return callback(new Errors.BadRequestError());

    start = start || "+inf";
    end = end || "-inf";

    async.waterfall([
        function (cb) {
            redis.zrevrangebyscore(
                redis.getKey(userWallPath, username),
                start,
                end,
                function (err, tweetsIds) {
                    if (err) {
                        return cb(new Errors.InternalError());
                    }
                    if (!tweetsIds) {
                        return cb(new Errors.NotFoundError());
                    }
                    cb(null, tweetsIds);
                }
            );
        },
        function (tweetsIds, cb) {
            async.map(tweetsIds, TweetDao.findOne, cb);
        }
    ], function (err, tweets) {
        callback(err, tweets);
    });
};

module.exports.propagateTweet = function (tweet, user, callback) {
    if (!tweet || !user)
        callback(new Errors.BadRequestError());

    // Propagate tweet on the user wall & every follower wall
    var propagateToUsers = user.followers.concat(user.username);

    async.each(
        propagateToUsers,
        function (follower, cb) {
            redis.zadd(
                redis.getKey(userWallPath, follower),
                tweet.date.getTime(),
                tweet.id,
                function (err) {
                    cb(err ? new Errors.InternalError() : null);
                }
            );
        }, function(err) {
            callback(err);
        }
    );
};

module.exports.appendTweets = function (followerUsername, followedUsername, callback) {
    if (!followerUsername || !followedUsername || followerUsername === followedUsername)
        return callback(new Errors.BadRequestError());

    redis.zunionstore(
        redis.getKey(userWallPath, followerUsername),
        2,
        redis.getKey(userWallPath, followerUsername),
        redis.getKey(TweetDao.usersPath, followedUsername),
        "AGGREGATE",
        "MIN",
        function (err) {
            callback(err ? new Errors.InternalError() : null);
        }
    );
};

// ZDIFF (zset1 - zset2) simulation :
//  - zunionstore zunion 2 zset1 zset2 WEIGHTS 1 -1
//  - zremrangebyscore zunion -inf 0
module.exports.removeTweets = function (followerUsername, followedUsername, callback) {
    if (!followerUsername || !followedUsername || followerUsername === followedUsername)
        return callback(new Errors.BadRequestError());

    async.series([
        function(cb) {
            redis.zunionstore(
                redis.getKey(userWallPath, followerUsername),
                2,
                redis.getKey(userWallPath, followerUsername),
                redis.getKey(TweetDao.usersPath, followedUsername),
                "WEIGHTS",
                1,
                -1,
                function (err, result) {
                    cb(err ? new Errors.InternalError() : null);
                }
            );
        },
        function(cb) {
            redis.zremrangebyscore(
                redis.getKey(userWallPath, followerUsername),
                '-inf',
                0,
                function (err, result) {
                    cb(err ? new Errors.InternalError() : null);
                }
            );
        }
    ], function(err) {
        callback(err);
    });
};