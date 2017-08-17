var debug = require('debug')('odin-api:helpers:session');
var config = require('../config/development');
var net = require('net');

var session = {};

session.start = function() {
    // Socket server for test purposes
    debug("Creating server on " + config.daemon.host + ":" + config.daemon.port);
    
    var server = net.createServer(function(socket) {
        socket.write('Echo server\r\n');
        socket.pipe(socket);
    });

    server.listen(8000, '127.0.0.1');


//     var client = new net.Socket();
//     client.connect(config.daemon.prt, config.daemon.host, function() {
//         debug("Connected to " + config.daemon.host + ":" + config.daemon.port);
//         client.write('Test');
//     });
    
//     client.on('data', function(data) {
//         debug('Received: ' + data);
//         // client.destroy(); // kill client after server's response
//     });
    
//     client.on('close', function() {
//         debug('Connection closed');
//     });
}


module.exports = session;