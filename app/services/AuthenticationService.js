var UserService = require('../services/UserService'),
    Errors = require('../utils/errors/Errors'),
    ModelFilter = require('../utils/filters/ModelFilter');

var authenticationFilter = ["username", "firstname", "lastname", "following"];

// **************************
//                  PRIVATE *
// **************************

var getAuthentication = function (session, callback) {
    if (!session.authentication) return new Errors.AuthenticationError();

    UserService.findOne(session.authentication.username, function (err, user) {
        if (err) return callback(err);
        if (!user) return callback(new Errors.AuthenticationError());

        callback(null, ModelFilter.include(user, authenticationFilter));
    });
};

var initSession = function (session, authentication) {
    session.authentication = {
        username: authentication
    }.username;
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
    getAuthentication(session, callback);
};

module.exports.signIn = function (session, username, password, callback) {
    if (session.logged) {
        killSession(session);
    }

    UserService.findOne(username, function (err, user) {
        if (err) return callback(err);
        if (!user) return callback(new Errors.AuthenticationError());

        if (user.password !== password) return callback(new Errors.AuthenticationError());

        initSession(session, user);
        getAuthentication(session, callback);
    });
};

module.exports.signOut = function (session, callback) {
    killSession(session);
    callback();
};

module.exports.isAuthenticated = function(session) {
    return !!session.authentication;
};