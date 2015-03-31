var configServer = require('./config/server.json'),
    configDB = require('./config/database.json'),
    configRoutes = require('./config/routes.json'),
    Server = require('./core/Server.class.js');

var server = new Server(configServer, configDB);
server.route(configRoutes);

server.start();