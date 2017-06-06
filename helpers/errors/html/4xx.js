var CustomError   = require('../custom');
var debug         = require('debug')('odin-api:helpers:errors:html:4xx');

debug('Defining html error class: ForbiddenError');
var ForbiddenError = function(detail){
  CustomError.call(this, 'Forbidden.');

  this.detail(detail)
      .status(403);

  return this;
};

debug('Defining html error class: NotFoundError');
var NotFoundError = function(detail){
  CustomError.call(this, 'Not found.');

  this.detail(detail)
      .status(404);

  return this;
};

debug('Defining html error class: UnauthorizedError');
var UnauthorizedError = function(detail){
  CustomError.call(this, 'Unauthorized.');

  this.detail(detail)
      .status(401);

  return this;
};


debug('Binding ForbiddenError to parent class: CustomError');
ForbiddenError.prototype = Object.create(CustomError.prototype);

debug('Binding NotFoundError to parent class: CustomError');
NotFoundError.prototype = Object.create(CustomError.prototype);

debug('Binding UnauthorizedError to parent class: CustomError');
UnauthorizedError.prototype = Object.create(CustomError.prototype);


debug('Exporting html 4xx error class: ForbiddenError');
module.exports.ForbiddenError = ForbiddenError;

debug('Exporting html 4xx error class: NotFoundError');
module.exports.NotFoundError = NotFoundError;

debug('Exporting html 4xx error class: UnauthorizedError');
module.exports.UnauthorizedError = UnauthorizedError;
