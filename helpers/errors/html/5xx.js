var CustomError   = require('../custom');
var debug         = require('debug')('odin-api:helpers:errors:html:4xx');

debug('Defining html error class: InternalServerError');
var InternalServerError = function(detail){
  CustomError.call(this, 'Internal server error.');

  this.detail(detail)
      .status(500);

  return this;
};

debug('Binding InternalServerError to parent class: CustomError');
InternalServerError.prototype = Object.create(CustomError.prototype);

debug('Exporting html 5xx error class: InternalServerError');
module.exports.InternalServerError = InternalServerError;
