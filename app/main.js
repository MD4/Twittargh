var configServer = require('./config/server.json'),
    configDB = require('./config/database.json'),
    configRoutes = require('./config/routes.json'),
    Server = require('./core/Server.class.js'),
    InitHelper = require('./utils/helpers/InitHelper');

var server = new Server(configServer, configDB);

// Database init
InitHelper.initializeDatabase();

// REST API routes setup
server.route(configRoutes);

// go Go GO !
server.start();