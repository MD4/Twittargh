var redis = require('./RedisHelper'),
    TweetService = require('../../services/TweetService'),
    UserService = require('../../services/UserService');

module.exports.initializeDatabase = function () {
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
            redis.hmset(redis.getKey(["users"], username), user, function () {
            });
        });

    TweetService.createTweet("mdequatr", {
        content: "Redrum ! #kill #redrum"
    }, function () {
    });
    TweetService.createTweet("rparker", {
        content: "1, 2, 3. Check, CHECK !"
    }, function () {
    });
    TweetService.createTweet("jsmith", {
        content: "Si ! Me gusta la cucaracha ! #cucaracha"
    }, function () {
    });
    TweetService.createTweet("jblack", {
        content: "YARRHG ! I'LL KILL YA ! #argh #kill"
    }, function () {
    });
    TweetService.createTweet("jsmith", {
        content: "Si Gringo ! #cucaracha Morre dolarrz ! #money #kill"
    }, function () {
    });
    TweetService.createTweet("jblack", {
        content: "GRRRR ! AAARRRHHH ! GRAAAAAARRGH ! #argh"
    }, function () {
    });
    TweetService.createTweet("mdequatr", {
        content: "Where did I put my axe ? #redrum"
    }, function () {
    });
    TweetService.createTweet("rparker", {
        content: "AHAHAH AHAHAHAHAH AHAHAHAHA !! #haha #kill"
    }, function () {
    });


    UserService.follow("mdequatr", "jblack", function () {
    });
    UserService.follow("mdequatr", "jsmith", function () {
    });
    UserService.follow("mdequatr", "rparker", function () {
    });
    UserService.follow("jblack", "jsmith", function () {
    });
    UserService.follow("jblack", "mdequatr", function () {
    });
    UserService.follow("rparker", "jsmith", function () {
    });
    UserService.follow("jsmith", "rparker", function () {
    });

}
