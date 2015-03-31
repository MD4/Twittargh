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
module.exports.getPrincipal = function (req, res, callback) {
    AuthenticationService.getPrincipal(req.session, callback);
};

/**
 * POST /signin
 */
module.exports.signIn = function (req, res, callback) {
    var data = req.body;

    Async.waterfall([
        function (cb) {
            var login = data.username;
            var password = data.password;
            AuthenticationService.signIn(req.session, login, password, cb);
        }
    ], function (err, principal) {
        callback(err, principal);
    });
};

/**
 * POST /signout
 */
module.exports.signOut = function (req, res, callback) {
    AuthenticationService.signOut(req.session, callback);
};