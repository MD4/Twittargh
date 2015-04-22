var async = require('async'),
    redis = require('../utils/helpers/RedisHelper'),
    Errors = require('../utils/errors/Errors');

var tweetsDataPath = module.exports.dataPath = ["tweets", "data"];
var tweetsUsersPath = module.exports.usersPath = ["tweets", "users"];

/**
 * Find a tweet by its id
 * @param id Tweet id
 * @param callback
 */
module.exports.findOne = function (id, callback) {
    redis.hgetall(redis.getKey(tweetsDataPath, id), function (err, tweet) {
        if (err) {
            return callback(new Errors.InternalError());
        }
        if (!tweet) {
            return callback(new Errors.NotFoundError());
        }
        tweet.id = id;
        callback(null, tweet);
    });
};

/**
 * Find tweets ids for a given owner
 * QUERY : zrevrangebyscore tweets:users:mdequatr +inf 0
 * @param username Owner username
 * @param callback
 * @param start (optional) Look for tweets older than that timestamp
 * @param end (optional) Look for tweets newer than that timestamp
 */
module.exports.findUserTweetsIds = function (username, callback, start, end) {
    start = start || "+inf";
    end = end || "-inf";

    redis.zrevrangebyscore(redis.getKey(tweetsUsersPath, username), start, end, function (err, tweetsIds) {
        if (err) {
            return callback(new Errors.InternalError());
        }
        if (!tweetsIds || !tweetsIds.length) {
            return callback(new Errors.NotFoundError());
        }
        callback(null, tweetsIds);
    });
};

/**
 * Find tweets ids for a given owner
 * @param username Owner username
 * @param callback
 * @param start (optional) Look for tweets older than that timestamp
 * @param end (optional) Look for tweets newer than that timestamp
 */
module.exports.findUserTweets = function (username, callback, start, end) {
    async.waterfall([
        function (cb) {
            this.findUserTweetsIds(username, cb, start, end);
        }.bind(this),
        function (tweetsIds, cb) {
            async.map(tweetsIds, this.findOne, cb);
        }.bind(this)
    ], function (err, tweets) {
        callback(err, tweets);
    });
};

/**
 * Save a tweet
 * QUERY : hmset tweets:data:UID content "Hey !"
 *         zadd tweets:users:mdequatr UID 2378621302
 * @param tweet Tweet to save
 * @param callback
 */
module.exports.save = function (tweet, callback) {
    if (!tweet || !tweet.content)
        return callback(new Errors.BadRequestError());

    async.series([
        function (cb) {
            redis.zadd(
                redis.getKey(tweetsUsersPath, tweet.username),
                tweet.date.getTime(),
                tweet.id,
                function(err) {
                    cb(err ? new Errors.InternalError() : null);
                }
            );
        }.bind(this),
        function (cb) {
            redis.hmset(
                redis.getKey(tweetsDataPath, tweet.id),
                tweet,
                function(err) {
                    cb(err ? new Errors.InternalError() : null);
                }
            );
        }.bind(this)
    ], function (err) {
        callback(err);
    });
};