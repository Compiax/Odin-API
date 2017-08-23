var html                = require('./html');
var CustomError         = require('./custom');
var debug               = require('debug')('odin-api:helpers:errors:auth');

// Typedef for easier usage.
var ForbiddenError = html._4xx.ForbiddenError;
var UnauthorizedError = html._4xx.UnauthorizedError;

/**
 * @todo: Discuss. It is debatable whether this class should inherit from
 * Unauthorized or from Forbidden. Will leave open for discussion.
 */

debug('Defining auth error class: AuthenticatedError');
var AuthenticatedError = function(){
  ForbiddenError.call(this, 'Already authenticated.');
  return this;
};

debug('Defining auth error class: InvalidCredentialsError');
var InvalidCredentialsError = function(){
  UnauthorizedError.call(this, 'Invalid credentials.');
  return this;
};

debug('Defining auth error class: NotAuthenticatedError');
var NotAuthenticatedError = function(){
  UnauthorizedError.call(this, 'Not authenticated.');
  return this;
};

debug('Binding AuthenticatedError to parent class: ForbiddenError');
AuthenticatedError.prototype = Object.create(ForbiddenError.prototype);

debug('Binding InvalidCredentialsError to parent class: UnauthorizedError');
InvalidCredentialsError.prototype = Object.create(UnauthorizedError.prototype);

debug('Binding NotAuthenticatedError to parent class: UnauthorizedError');
NotAuthenticatedError.prototype = Object.create(UnauthorizedError.prototype);


debug('Exporting auth error class: AuthenticatedError');
module.exports.AuthenticatedError = AuthenticatedError;

debug('Exporting auth error class: InvalidCredentialsError');
module.exports.InvalidCredentialsError = InvalidCredentialsError;

debug('Exporting auth error class: NotAuthenticatedError');
module.exports.NotAuthenticatedError = NotAuthenticatedError;
