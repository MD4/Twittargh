var Async = require('async'),
    AuthenticationService = require('../services/AuthenticationService'),
    TweetService = require('../services/TweetService'),
    Errors = require('../utils/errors/Errors');

// **************************
//                  PRIVATE *
// **************************

// **************************
//                   PUBLIC *
// **************************

/**
 * GET /tweets/:userid
 */
module.exports.getTweetsForUser = function (req, res, callback) {
    if (!AuthenticationService.isAuthenticated(req.session))
        return callback(new Errors.AuthenticationError());

    var data = req.params;
    var params = req.query;

    TweetService.findUserTweets(data.username, callback, params.start, params.end);
};

/**
 * POST /tweets
 */
module.exports.postTweet = function (req, res, callback) {
    var user = AuthenticationService.getAuthentication(req.session);

    if (!user)
        return callback(new Errors.AuthenticationError());

    var tweetData = req.body;

    TweetService.createTweet(user, tweetData, callback);
};
