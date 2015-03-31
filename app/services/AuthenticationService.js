var Async = require('async');

// **************************
//                  PRIVATE *
// **************************

// **************************
//                   PUBLIC *
// **************************

/**
 * GET /auth
 */
module.exports.getPrincipal = function (session, callback) {
    if (session.user) {
        callback(null, session.user);
    } else {
        callback({
            error: true,
            code: 401,
            message: "Unauthorized"
        });
    }
};

/**
 * POST /signin
 */
module.exports.signIn = function (session, login, password, callback) {
    var user = {
        username: "mdequa",
        password: "password"
    };

    if (user) {
        callback(null, user);
    } else {
        callback({
            error: true,
            code: 404,
            message: "Not found"
        });
    }
};

/**
 * POST /signout
 */
module.exports.signOut = function (req, res, callback) {
    AuthenticationService.signOut(req.session, callback);
};