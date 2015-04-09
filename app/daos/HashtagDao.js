var async = require('async'),
    redis = require('../utils/helpers/RedisHelper'),
    Errors = require('../utils/errors/Errors'),
    TweetDao = require('../daos/TweetDao'),
    WallDao = require('../daos/WallDao');

var tweetsHashtagsPath = module.exports.hashtagsPath = ["tweets", "hashtags"];


module.exports.propagateTweet = function (tweet, hashtags, callback) {
    if (!tweet || !hashtags)
        callback(new Errors.BadRequestError());

    async.each(
        hashtags,
        function (hashtag, cb) {
            redis.zadd(
                redis.getKey(WallDao.wallPath, hashtag),
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


module.exports.findHashtagTweetsIds = function (hashtag, callback, start, end) {
    start = start || "+inf";
    end = end || "-inf";

    redis.zrevrangebyscore(redis.getKey(tweetsHashtagsPath, hashtag), start, end, function (err, tweetsIds) {
        if (err) {
            return callback(new Errors.InternalError());
        }
        if (!tweetsIds || !tweetsIds.length) {
            return callback(new Errors.NotFoundError());
        }
        callback(null, tweetsIds);
    });
};


module.exports.findHashtagTweets = function (hashtag, callback, start, end) {
    async.waterfall([
        function (cb) {
            this.findHashtagTweetsIds(hashtag, cb, start, end);
        }.bind(this),
        function (tweetsIds, cb) {
            async.map(tweetsIds, TweetDao.findOne, cb);
        }.bind(this)
    ], function (err, tweets) {
        callback(err, tweets);
    });
};