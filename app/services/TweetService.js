var async = require('async'),
    TweetFactory = require('../factories/TweetFactory'),
    TweetDao = require('../daos/TweetDao'),
    WallDao = require('../daos/WallDao'),
    UserDao = require('../daos/UserDao'),
    HashtagDao = require('../daos/HashtagDao');

/**
 * Get a tweet by its id
 * @param id Tweet id
 * @param callback
 */
module.exports.findOne = function (id, callback) {
    TweetDao.findOne(id, callback);
};

/**
 * Find every tweet of a given user
 * @param username User username
 * @param callback
 * @param start (optional) Look for tweets older than that timestamp
 * @param end (optional) Look for tweets newer than that timestamp
 */
module.exports.findUserTweets = function (username, callback, start, end) {
    TweetDao.findUserTweets(username, callback, start, end);
};

/**
 * Find every tweet of a given hashtag
 * @param hashtag Hashtag name
 * @param callback
 * @param start (optional) Look for tweets older than that timestamp
 * @param end (optional) Look for tweets newer than that timestamp
 */
module.exports.findHashtagTweets = function (hashtag, callback, start, end) {
    HashtagDao.findHashtagTweets(hashtag, callback, start, end);
};

/**
 * Get every wall tweet of a given user
 * @param username User username
 * @param callback
 * @param start (optional) Look for tweets older than that timestamp
 * @param end (optional) Look for tweets newer than that timestamp
 */
module.exports.getWall = function (username, callback, start, end) {
    WallDao.getWall(username, callback, start, end)
};

/**
 * Posts a tweet
 * @param username User username
 * @param tweetData Tweet data
 * @param callback
 */
module.exports.createTweet = function (username, tweetData, callback) {
    async.waterfall([
        function (cb) {
            UserDao.findOne(username, cb);
        },
        function(user, cb) {
            TweetFactory.create(user, tweetData, function(err, tweet) {
                cb(err, tweet, user);
            });
        },
        function (tweet, user, cb) {
            async.series([
                function (cb) {
                    TweetDao.save(tweet, cb);
                },
                function (cb) {
                    WallDao.propagateTweet(tweet, user, cb);
                },
                function(cb) {
                    HashtagDao.propagateTweet(tweet, cb)
                }
            ], cb);
        }
    ], function (err) {
        callback(err);
    });
};