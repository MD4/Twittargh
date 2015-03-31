var Async = require('async'),
    UserService = require('../services/UserService'),
    Errors = require('../utils/errors/Errors'),
    ModelFilter = require('../utils/filters/ModelFilter');

var authenticationFilter = ["username", "firstname", "lastname"];

// **************************
//                  PRIVATE *
// **************************

var getAuthentication = function (session) {
    return ModelFilter.include(session.authentication, authenticationFilter);
};

var initSession = function (session, authentication) {
    session.authentication = ModelFilter.include(authentication, authenticationFilter);
    session.logged = true;
};

var killSession = function (session) {
    delete session.authentication;
    delete session.logged;
};

// **************************
//                   PUBLIC *
// **************************

module.exports.getAuthentication = function (session, callback) {
    var authentication = getAuthentication(session);
    callback(null, authentication);
};

module.exports.signIn = function (session, username, password, callback) {
    if (session.logged) {
        killSession(session);
    }

    UserService.find(username, function (err, user) {
        if (err) return callback(err);
        if (!user) return callback(new Errors.AuthenticationError());

        if (user.password !== password) return callback(new Errors.AuthenticationError());

        initSession(session, user);
        callback(null, getAuthentication(session));
    });
};

module.exports.signOut = function (session, callback) {
    killSession(session);
    callback();
};