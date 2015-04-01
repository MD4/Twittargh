var async = require('async'),
    AuthenticationService = require('../services/AuthenticationService'),
    UserService = require('../services/UserService'),
    Errors = require('../utils/errors/Errors'),
    ModelFilter = require('../utils/filters/ModelFilter');

var userFilter = ["username", "firstname", "lastname", "following", "followers"];

// **************************
//                  PRIVATE *
// **************************

// **************************
//                   PUBLIC *
// **************************

/**
 * GET /users/:username
 */
module.exports.getUser = function (req, res, callback) {
    if (!AuthenticationService.isAuthenticated(req.session))
        return callback(new Errors.AuthenticationError());
    var data = req.params;

    UserService.findOne(data.username, function (err, user) {
        callback(err, ModelFilter.include(user, userFilter));
    });
};


/**
 * POST /users/:username/follow
 */
module.exports.follow = function (req, res, callback) {
    var user = AuthenticationService.getAuthentication(req.session),
        data = req.params;

    if (!user)
        return callback(new Errors.AuthenticationError());

    UserService.follow(user.username, data.username, callback);
};