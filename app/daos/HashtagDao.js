var async = require('async'),
    redis = require('../utils/helpers/RedisHelper'),
    Errors = require('../utils/errors/Errors'),
    TweetDao = require('../daos/TweetDao');

var tweetsHashtagsPath = module.exports.hashtagsPath = ["tweets", "hashtags"];

/**
 * Propagate a tweet on every hashtag mentioned
 * @param tweet Tweet to propagate
 * @param callback
 */
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

/**
 * Find ids of every tweet linked to the given hashtag
 * @param hashtag Hashtag to look for
 * @param callback
 * @param start (optional) Look for tweets older than that timestamp
 * @param end (optional) Look for tweets newer than that timestamp
 */
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

/**
 * Find every tweet linked to the given hashtag
 * @param hashtag Hashtag to look for
 * @param callback
 * @param start (optional) Look for tweets older than that timestamp
 * @param end (optional) Look for tweets newer than that timestamp
 */
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