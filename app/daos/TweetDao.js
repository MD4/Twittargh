var async = require('async'),
    redis = require('../utils/helpers/RedisHelper'),
    Errors = require('../utils/errors/Errors'),
    uuid = require('node-uuid');

var tweetsDataPath = module.exports.path = ["tweets", "data"];
var tweetsUsersPath = module.exports.path = ["tweets", "users"];

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
    var tweetId = uuid.v4();
    async.series([
        function (cb) {
            console.log(tweet.date.getTime());
            redis.zadd(
                redis.getKey(tweetsUsersPath, tweet.user),
                tweet.date.getTime(),
                tweetId,
                cb
            );
        }.bind(this),
        function (cb) {
            redis.hmset(
                redis.getKey(tweetsDataPath, tweetId),
                tweet,
                cb
            );
        }.bind(this)
    ], function (err, result) {
        callback(err, result);
    });
};