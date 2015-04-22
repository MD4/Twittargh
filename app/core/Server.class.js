var express = require("express"),
    http = require("http"),
    server = module.exports = express(),
    session = require('express-session'),
    bodyParser = require('body-parser'),
    cookieParser = require('cookie-parser'),
    RedisStore = require('connect-redis')(session);

/**
 * Server constructor
 * @param serverSettings JSON server settings
 * @param dbSettings JSON database settings
 * @constructor
 */
var Server = function (serverSettings, dbSettings) {
    this.settings = serverSettings || {};
    this.dbSettings = dbSettings || {};

    server.use(express.errorHandler({
        dumpExceptions: true,
        showStack: true
    }));

    server.use(bodyParser.json());
    server.use(cookieParser());

    server.use(session({
        store: new RedisStore(this.dbSettings),
        secret: 'i love undead unicorns'
    }));

    server.use(function (req, res, next) {
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
        res.header("Access-Control-Allow-Credentials", "true");
        next();
    });

    server.use(server.router);

    server.use(express.static(__dirname + '/../../public/app'));

    this.server = server;
};

/**
 * Starts the server
 */
Server.prototype.start = function () {
    http.createServer(this.server).listen(this.settings.port);

    console.log("* Twittargh server *");
    console.log("settings : ");
    console.log(this.settings);
    console.log("* Server started ! *");
    console.log();
};

/**
 * Initialize REST API routes
 * @param routes JSON routes configuration
 */
Server.prototype.route = function (routes) {

    routes.forEach(function (route) {
        var controller = require('../controllers/' + route.controller);
        this.server[route.method](this.settings.apiRoot + route.url, function (req, res) {
            controller[route.functionName](req, res, function (err, result) {
                if (err) {
                    res.statusCode = err.code;
                    console.log(err);
                    res.send(err);
                } else {
                    res.statusCode = 200;
                    res.send(result);
                }
            });
        });
    }.bind(this));
};

module.exports = Server;