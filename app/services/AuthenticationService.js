var UserService = require('../services/UserService'),
    Errors = require('../utils/errors/Errors'),
    ModelFilter = require('../utils/filters/ModelFilter');

var authenticationFilter = ["username", "firstname", "lastname", "following"];

// **************************
//                  PRIVATE *
// **************************

/**
 * Get the current user authentication
 * @param session User session
 * @param callback
 * @returns {exports.AuthenticationError}
 */
var getAuthentication = function (session, callback) {
    if (!session.authentication) return new Errors.AuthenticationError();
    console.log(session.authentication);
    UserService.findOne(session.authentication.username, function (err, user) {
        if (err) return callback(err);
        if (!user) return callback(new Errors.AuthenticationError());

        callback(null, ModelFilter.include(user, authenticationFilter));
    });
};

/**
 * Initialize the user session
 * @param session  User session
 * @param authentication User authentication
 */
var initSession = function (session, authentication) {
    session.authentication = authentication;
    session.logged = true;
};

/**
 * Destroys the user session
 * @param session
 */
var killSession = function (session) {
    delete session.authentication;
    delete session.logged;
};

// **************************
//                   PUBLIC *
// **************************

/**
 * Get the current user authentication
 * @param session User session
 * @param callback
 */
module.exports.getAuthentication = function (session, callback) {
    getAuthentication(session, callback);
};

/**
 * User sign in
 * @param session User session
 * @param username User username
 * @param password User password
 * @param callback
 */
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

/**
 * User sign out
 * @param session User session
 * @param callback
 */
module.exports.signOut = function (session, callback) {
    killSession(session);
    callback();
};

/**
 * Check if the user is authenticated
 * @param session User session
 * @returns {boolean}
 */
module.exports.isAuthenticated = function(session) {
    return !!session.authentication;
};