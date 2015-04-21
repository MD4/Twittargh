var async = require('async'),
    Errors = require('../utils/errors/Errors'),
    uuid = require('node-uuid');


module.exports.create = function(user, tweetData, callback) {
    if (!user || !tweetData || !tweetData.content)
        return callback(new Errors.BadRequestError());

    var tweetContent = tweetData.content;

    var hashtags = tweetContent.match(/[#]+[A-Za-z0-9-_]+/g) || [];

    // Remove the '#'
    hashtags = hashtags.map(function(hashtag){
        return hashtag.substr(1);
    });

    var tweet = {
        id: uuid.v4(),
        username: user.username,
        firstname: user.firstname,
        lastname: user.lastname,
        content: tweetContent,
        date: new Date(),
        hashtags: hashtags
    };

    callback(null, tweet);
};

