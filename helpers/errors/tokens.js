var html          = require('./html');
var CustomError   = require('./custom');
var debug         = require('debug')('odin-api:helpers:errors:tokens');

// Typedef for easier usage.
var NotFoundError = html._4xx.NotFoundError;

debug('Defining tokens error class: TokenNotFoundError');
var TokenNotFoundError = function(){
  NotFoundError.call(this, 'Token not found.');
  return this;
};


debug('Binding TokenNotFoundError to parent class: NotFoundError');
TokenNotFoundError.prototype = Object.create(NotFoundError.prototype);


debug('Exporting tokens error class: TokenNotFoundError');
module.exports.TokenNotFoundError = TokenNotFoundError;
