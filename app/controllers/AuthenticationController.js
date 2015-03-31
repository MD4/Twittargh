var Async = require('async'),
    AuthenticationService = require('../services/AuthenticationService');

// **************************
//                  PRIVATE *
// **************************

// **************************
//                   PUBLIC *
// **************************

/**
 * GET /auth
 */
module.exports.getAuthentication = function (req, res, callback) {
    AuthenticationService.getAuthentication(req.session, callback);
};

/**
 * GET /signin
 */
module.exports.signIn = function (req, res, callback) {
    var data = req.query;

    Async.waterfall([
        function (cb) {
            var username = data.username;
            var password = data.password;

            AuthenticationService.signIn(req.session, username, password, cb);
        }
    ], function (err, user) {
        callback(err, user);
    });
};

/**
 * POST /signout
 */
module.exports.signOut = function (req, res, callback) {
    AuthenticationService.signOut(req.session, callback);
};