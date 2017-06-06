var html                = require('./html');
var CustomError         = require('./custom');
var debug               = require('debug')('odin-api:helpers:errors:global');

// Typedef for easier usage.
var InternalServerError = html._5xx.InternalServerError;

debug('Defining auth error class: NotImplementedError');
var NotImplementedError = function(){
  InternalServerError.call(this, 'Not implemented yet.');
  return this;
};

debug('Binding NotImplementedError to parent class: InternalServerError');
NotImplementedError.prototype = Object.create(InternalServerError.prototype);

debug('Exporting auth error class: NotImplementedError');
module.exports.NotImplementedError = NotImplementedError;
