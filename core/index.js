var _         = require('lodash');
var app       = require('./app');
var config    = require('../config/development');
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
    var port = config.port;

    this.app.listen(port, function(){
        debug('Listening on http://localhost:' + port);
    });
};

debug('Core exported');
module.exports = OdinAPI;