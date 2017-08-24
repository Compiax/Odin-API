var _         = require('lodash');
var app       = require('./app');
var config    = require('config');
var debug     = require('debug')('odin-api:core');


var OdinAPI = function() {
    this.app = null;

    /**
     * Construct app.
     */
    debug('Creating app');
    this.app = app.init();

    /**
     * Construct server.
     */
    debug('Creating server');
    var host = config.servers.http.host;
    var port = config.servers.http.port;
    
    this.app.listen(port, function(){
      debug(`Listening on ${host}:${port}`);
    });
};

debug('Core exported');
module.exports = OdinAPI;
