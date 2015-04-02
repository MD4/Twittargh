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
 * GET /wall
 */
module.exports.getWall = function (req, res, callback) {
    var authentication = AuthenticationService.getAuthentication(req.session);

    var params = req.query;

    if (!authentication)
        return callback(new Errors.AuthenticationError());

    TweetService.getWall(authentication.username, callback, params.start, params.end);
};