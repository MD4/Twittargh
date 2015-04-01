var async = require('async'),
    TweetDao = require('../daos/TweetDao');

module.exports.findOne = function (id, callback) {
    TweetDao.findOne(id, callback);
};

module.exports.findUserTweets = function (username, callback, start, end) {
    TweetDao.findUserTweets(username, callback, start, end);
};

module.exports.createTweet = function(user, tweetData, callback) {
    var tweet = {
        user: user.username,
        content: tweetData.content,
        date: new Date()
    };

    TweetDao.save(tweet, callback);
};

module.exports.getWall = function(user, start, end, callback) {

};