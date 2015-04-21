var configDb = require('../../config/database.json'),
    redis = require('redis'),
    client = redis.createClient();

client.select(configDb.db);

client.on('error', function (err) {
    console.error('Redis error', err);
});

client.getKey = function(path, name) {
    return path.concat(name).join(':');
};

module.exports = client;