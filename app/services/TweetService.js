var async = require('async'),
    TweetFactory = require('../factories/TweetFactory'),
    TweetDao = require('../daos/TweetDao'),
    WallDao = require('../daos/WallDao'),
    UserDao = require('../daos/UserDao'),
    HashtagDao = require('../daos/HashtagDao');

module.exports.findOne = function (id, callback) {
    TweetDao.findOne(id, callback);
};

module.exports.findUserTweets = function (username, callback, start, end) {
    TweetDao.findUserTweets(username, callback, start, end);
};

module.exports.findHashtagTweets = function (hashtag, callback, start, end) {
    HashtagDao.findHashtagTweets(hashtag, callback, start, end);
};

module.exports.getWall = function (username, callback, start, end) {
    WallDao.getWall(username, callback, start, end)
};

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