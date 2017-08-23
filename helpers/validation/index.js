var debug           = require('debug')('odin-api:helpers:validation');
var registration    = require('./registration.js');
var login           = require('./login.js');
var validator       = require('validator');

debug('Adding validation method: registration');
module.exports.registration = registration;

debug('Adding validation method: login');
module.exports.login = login;
