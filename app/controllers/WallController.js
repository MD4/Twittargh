var AuthenticationService = require('../services/AuthenticationService'),
    TweetService = require('../services/TweetService');
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
    var params = req.query;

    AuthenticationService.getAuthentication(req.session, function(err, authentication) {
        if (err) {
            return callback(err);
        }

        TweetService.getWall(authentication.username, callback, params.start, params.end);
    });
};