var AuthenticationService = require('../services/AuthenticationService'),
    TweetService = require('../services/TweetService'),
    Errors = require('../utils/errors/Errors');

// **************************
//                  PRIVATE *
// **************************

// **************************
//                   PUBLIC *
// **************************

/**
 * GET /tweets/:username
 */
module.exports.getTweetsForUser = function (req, res, callback) {
    if (!AuthenticationService.isAuthenticated(req.session))
        return callback(new Errors.AuthenticationError());

    var data = req.params;
    var params = req.query;

    TweetService.findUserTweets(data.username, callback, params.start, params.end);
};

/**
 * GET /tweets/:username
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
    var authentication = AuthenticationService.getAuthentication(req.session);

    if (!authentication)
        return callback(new Errors.AuthenticationError());

    var tweetData = req.body;

    console.log(tweetData);

    TweetService.createTweet(authentication.username, tweetData, callback);
};
