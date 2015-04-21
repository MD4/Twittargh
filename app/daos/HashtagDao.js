var async = require('async'),
    redis = require('../utils/helpers/RedisHelper'),
    Errors = require('../utils/errors/Errors'),
    TweetDao = require('../daos/TweetDao');

var tweetsHashtagsPath = module.exports.hashtagsPath = ["tweets", "hashtags"];


module.exports.propagateTweet = function (tweet, callback) {
    if (!tweet)
        callback(new Errors.BadRequestError());
    async.each(
        tweet.hashtags,
        function (hashtag, cb) {
            redis.zadd(
                redis.getKey(tweetsHashtagsPath, hashtag),
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