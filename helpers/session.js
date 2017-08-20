var debug = require('debug')('odin-api:helpers:session');
var config = require('../config/development');
var net = require('net');

var session = {};

session.start = function() {
    // Socket server for test purposes
    // debug("Creating server on " + config.daemon.host + ":" + config.daemon.port);
    
    // var server = net.createServer(function(socket) {
    //     debug("Server started");
    //     socket.write('Echo server\r\n');
    //     socket.pipe(socket);
    // });

    // server.listen(8000, config.daemon);

    var variables  = ["{ name: 'a', dimensions: [2 2], value: [1, 1, 1, 1]}",
                      "{ name: 'b', dimensions: [2 2], value: [1, 1, 1, 1]",
                      "{ name: 'c', dimensions: [2 2] }",
                      "{ name: 'result', dimensions: [2 2] }"];
    var operations = ["ADD a, b, c", "SUM b, c, d", "DOT a, a, result"];


    var client = new net.Socket();
    debug("Attempting to connect to " + config.daemon.host + ":" + config.daemon.port);
    client.connect(config.daemon.port, config.daemon.host, function() {
        debug("Connected to " + config.daemon.host + ":" + config.daemon.port);
        debug("Sending variables:");
        variables.forEach((item) => {
            client.write(item) + "\n";
            debug(item);
        });
        debug("Sending operations:");
        operations.forEach((item) => {
            client.write(item) + "\n";
            debug(item);
        })
        debug("Session sent. Awaiting result");
    });
    
    client.on('data', function(data) {
        debug('Received result:');
        debug(String(data));
        // client.destroy(); // kill client after server's response
    });
    
    client.on('close', function() {
        debug('Connection closed');
    });
}


module.exports = session;