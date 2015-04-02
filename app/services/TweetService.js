var async = require('async'),
    TweetDao = require('../daos/TweetDao'),
    WallDao = require('../daos/WallDao'),
    UserDao = require('../daos/UserDao'),
    uuid = require('node-uuid');

module.exports.findOne = function (id, callback) {
    TweetDao.findOne(id, callback);
};

module.exports.findUserTweets = function (username, callback, start, end) {
    TweetDao.findUserTweets(username, callback, start, end);
};

module.exports.getWall = function (username, callback, start, end) {
    WallDao.getWall(username, callback, start, end)
};

module.exports.createTweet = function (username, tweetData, callback) {
    var tweet = {
        id: uuid.v4(),
        username: username,
        content: tweetData.content,
        date: new Date()
    };

    async.waterfall([
       function(cb) {
           UserDao.findOne(username, cb);
       },
        function(user, cb) {
            async.series([
                function (cb) {
                    TweetDao.save(tweet, cb);
                },
                function (cb) {
                    WallDao.propagateTweet(tweet, user, cb);
                }
            ], cb);
        }
    ], function(err) {
        callback(err);
    });
};