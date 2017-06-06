var _         = require('lodash');
var app       = require('./app');
var config    = require('config');
var debug     = require('debug')('odin-api:core');

/**
  * Class OdinApi
  *  - Property server (http node server)
  *  - Property app (express app)
  *  - Config (config module, for global access)
  *  - Globals (reference to shared instances)
  * @param Object _config Config to override defaults from config files.
  */
var OdinApi = function(_config){
  this.config = config;
  this.app = null;
  /**
   * Override config if passed as parameter
   */
  if((_config) && (typeof _config === 'object') && !(_config instanceof Array)){
    debug('Overriding config');
    this.config = _.merge(config, _config);
  }

  debug('Dumping config:');
  debug("%o", this.config);

  /**
   * Construct app.
   */
  debug('Creating app');
  this.app = app.init(this.config);

  /**
   * Construct server.
   * @todo: Make pure http server not just express app listen.
   */
  debug('Creating server');
  var port = this.config.servers.http.port;

  this.app.listen(port, function(){
    debug('Listening on http://localhost:' + port);
  });
};

debug('Core exported');
module.exports = OdinApi;
