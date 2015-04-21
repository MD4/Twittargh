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
 * GET /tweets/hashtag/:hashtag
 */
module.exports.getTweetsForHashtag = function (req, res, callback) {
    if (!AuthenticationService.isAuthenticated(req.session))
        return callback(new Errors.AuthenticationError());

    var data = req.params;
    var params = req.query;

    TweetService.findHashtagTweets(data.hashtag, callback, params.start, params.end);
};

/**
 * POST /tweets
 */
module.exports.postTweet = function (req, res, callback) {
    var tweetData = req.body;

    AuthenticationService.getAuthentication(req.session, function(err, authentication) {
        if (err) {
            return callback(err);
        }

        TweetService.createTweet(authentication.username, tweetData, callback);
    });

};
