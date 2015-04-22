var redis = require('./RedisHelper'),
    TweetService = require('../../services/TweetService'),
    UserService = require('../../services/UserService');

/**
 * Initializes the database with test data
 */
module.exports.initializeDatabase = function () {
    redis.hgetall("users:mdequatr", function (err, dummyUser) {
        if (!dummyUser) {
            initializeUsers();
        }
    });
};

/**
 * Test data
 */
function initializeUsers() {
    [
        {
            username: "jtorrance",
            firstname: "Jack",
            lastname: "TORRANCE"
        },
        {
            username: "mcorleone",
            firstname: "Michael",
            lastname: "CORLEONE"
        },
        {
            username: "joker",
            firstname: "Jo",
            lastname: "KER"
        },
        {
            username: "hlecter",
            firstname: "Hannibal",
            lastname: "LECTER"
        },
        {
            username: "ca",
            firstname: "Gripsou",
            lastname: "LE CLOWN"
        },
        {
            username: "kfrueger",
            firstname: "Kreddy",
            lastname: "Frueger"
        },
        {
            username: "pgonzales",
            firstname: "Pedro",
            lastname: "GONZALES"
        },
        {
            username: "dvador",
            firstname: "Dark",
            lastname: "VADOR"
        }
    ].forEach(function (user) {
            var username = user.username;
            delete user.username;
            user.password = "password";
            redis.hmset(redis.getKey(["users"], username), user, function () {
            });
        });

    TweetService.createTweet("jtorrance", {
        content: "Redrum ! #kill #redrum"
    }, function () {
    });
    TweetService.createTweet("joker", {
        content: "1, 2, 3. Check, CHECK !"
    }, function () {
    });
    TweetService.createTweet("mcorleone", {
        content: "Si ! Me gusta la cucaracha ! #cucaracha"
    }, function () {
    });
    TweetService.createTweet("hlecter", {
        content: "YARRHG ! I'LL KILL YA ! #argh #kill"
    }, function () {
    });
    TweetService.createTweet("mcorleone", {
        content: "Si Gringo ! #cucaracha Morre dolarrz ! #money #kill"
    }, function () {
    });
    TweetService.createTweet("hlecter", {
        content: "GRRRR ! AAARRRHHH ! GRAAAAAARRGH ! #argh"
    }, function () {
    });
    TweetService.createTweet("jtorrance", {
        content: "Where did I put my axe ? #redrum"
    }, function () {
    });
    TweetService.createTweet("joker", {
        content: "AHAHAH AHAHAHAHAH AHAHAHAHA !! #haha #kill"
    }, function () {
    });


    UserService.follow("jtorrance", "hlecter", function () {
    });
    UserService.follow("jtorrance", "mcorleone", function () {
    });
    UserService.follow("jtorrance", "joker", function () {
    });
    UserService.follow("hlecter", "mcorleone", function () {
    });
    UserService.follow("hlecter", "jtorrance", function () {
    });
    UserService.follow("joker", "mcorleone", function () {
    });
    UserService.follow("mcorleone", "joker", function () {
    });

}
