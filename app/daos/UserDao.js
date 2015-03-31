var redis = require('../utils/helpers/RedisHelper'),
    Errors = require('../utils/errors/Errors');

var userPath = module.exports.path = ["users"];

module.exports.find = function (username, callback) {
    redis.hgetall(redis.getKey(userPath, username), function (err, user) {
        if (err) {
            return callback(new Errors.InternalError());
        }
        if (!user) {
            return callback(new Errors.NotFoundError());
        }
        user.username = username;
        callback(null, user);
    });
};