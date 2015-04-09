var async = require('async'),
    redis = require('../utils/helpers/RedisHelper'),
    Errors = require('../utils/errors/Errors');

var tweetsDataPath = module.exports.dataPath = ["tweets", "data"];
var tweetsUsersPath = module.exports.usersPath = ["tweets", "users"];

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

// zrevrangebyscore tweets:users:mdequatr +inf 0

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

// hmset tweets:data:UID content "Hey !"
// zadd tweets:users:mdequatr UID 2378621302
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