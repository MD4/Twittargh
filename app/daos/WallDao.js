var async = require('async'),
    redis = require('../utils/helpers/RedisHelper'),
    Errors = require('../utils/errors/Errors'),
    TweetDao = require('../daos/TweetDao');

var userWallPath = module.exports.wallPath = ["users", "walls"];

/**
 * Get every tweets on the given user wall
 * @param username User username
 * @param callback
 * @param start (optional) Look for tweets older than that timestamp
 * @param end (optional) Look for tweets newer than that timestamp
 */
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

/**
 * Propagate a tweet on the walls of every followers
 * @param tweet Tweet to propagate
 * @param user Tweet owner
 * @param callback
 */
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
        }, function (err) {
            callback(err);
        }
    );
};

/**
 * Append on the user wall every tweets of a given user
 * @param followerUsername Following user username
 * @param followedUsername Followed user username
 * @param callback
 */
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

/**
 * QUERY : ZDIFF (zset1 - zset2) simulation :
 *   - zunionstore zunion 2 zset1 zset2 WEIGHTS 1 -1
 *   - zremrangebyscore zunion -inf 0
 * @param followerUsername Following user username
 * @param followedUsername Followed user username
 * @param callback
 */
module.exports.removeTweets = function (followerUsername, followedUsername, callback) {
    if (!followerUsername || !followedUsername || followerUsername === followedUsername)
        return callback(new Errors.BadRequestError());

    redis.multi()

        .zunionstore(
        redis.getKey(userWallPath, followerUsername),
        2,
        redis.getKey(userWallPath, followerUsername),
        redis.getKey(TweetDao.usersPath, followedUsername),
        "WEIGHTS",
        1,
        -1)

        .zremrangebyscore(
        redis.getKey(userWallPath, followerUsername),
        '-inf',
        0)

        .exec(function (err) {
            callback(err);
        });
};