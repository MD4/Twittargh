var redis = require('./RedisHelper');

module.exports.initializeDatabase = function() {
    redis.hgetall("users:mdequatr", function (err, dummyUser) {
        if (!dummyUser) {
            initializeUsers();
        }
    });
};

function initializeUsers() {
    [
        {
            username: "jblack",
            firstname: "Jack",
            lastname: "BLACK"
        },
        {
            username: "jsmith",
            firstname: "John",
            lastname: "SMITH"
        },
        {
            username: "rparker",
            firstname: "Ron",
            lastname: "PARKER"
        },
        {
            username: "mdequatr",
            firstname: "Martin",
            lastname: "DEQUATREMARE"
        }
    ].forEach(function (user) {
            var username = user.username;
            delete user.username;
            user.password = "password";
            redis.hmset(redis.getKey(["users"], username), user, function (err, result) {
                console.log(err, result);
            });
        });
}
