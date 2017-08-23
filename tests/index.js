var OdinApi    = require('../core');
var config          = require('config');
var e2e             = require('./e2e');
var helpers         = require('./helpers');

/**
 * Adjust config to cater for testing environment.
 */
config.servers.db.database += '-test';
config.servers.http.port = parseInt(config.servers.http.port) + 1;

var OdinApi = new OdinApi(config);

describe('tests =>', function() {
  var app = OdinApi.app;

  e2e.test(app);
  helpers.test();
});
