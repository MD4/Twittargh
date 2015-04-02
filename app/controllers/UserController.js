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
    var authentication = AuthenticationService.getAuthentication(req.session),
        data = req.params;

    if (!authentication)
        return callback(new Errors.AuthenticationError());

    UserService.follow(authentication.username, data.username, callback);
};


/**
 * POST /users/:username/unfollow
 */
module.exports.unfollow = function (req, res, callback) {
    var authentication = AuthenticationService.getAuthentication(req.session),
        data = req.params;

    if (!authentication)
        return callback(new Errors.AuthenticationError());

    UserService.unfollow(authentication.username, data.username, callback);
};

/**
 * GET /users/:username/followers
 */
module.exports.getFollowers = function(req, res, callback) {
    if (!AuthenticationService.isAuthenticated(req.session))
        return callback(new Errors.AuthenticationError());

    var data = req.params;

    UserService.getFollowers(data.username, callback);
};

/**
 * GET /users/:username/following
 */
module.exports.getFollowing = function(req, res, callback) {
    if (!AuthenticationService.isAuthenticated(req.session))
        return callback(new Errors.AuthenticationError());

    var data = req.params;

    UserService.getFollowing(data.username, callback);
};