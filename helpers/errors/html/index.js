var debug   = require('debug')('odin-api:helpers:errors:html');
var _4xx    = require('./4xx');
var _5xx    = require('./5xx');

debug('Adding html errors type: 4xx');
module.exports._4xx = _4xx;

debug('Adding html errors type: 5xx');
module.exports._5xx = _5xx;
