var auth          = require('./auth');
var CustomError   = require('./custom');
var debug         = require('debug')('odin-api:helpers:errors');
var general       = require('./general');
var html          = require('./html');
var tokens        = require('./tokens');
var users         = require('./users');

debug('Adding errors type: CustomError');
module.exports.CustomError = CustomError;

debug('Adding errors type: auth');
module.exports.auth = auth;

debug('Adding errors type: general');
module.exports.general = general;

debug('Adding errors type: html');
module.exports.html = html;

debug('Adding errors type: tokens');
module.exports.tokens = tokens;

debug('Adding errors type: users');
module.exports.users = users;
