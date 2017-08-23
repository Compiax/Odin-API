var debug = require('debug')('odin-api:helpers:errors:custom');

/**
 * -----------------------------------------------------------------------------
 * This is the custom Error class that Odin API will use.
 * This class is built specifically to be used for HTML xxx client errors as well as
 * contain information relating to HTML statusses.
 * -----------------------------------------------------------------------------
 *
 * The CustomError class is monadic with the following monadic setters.
 * @function  message (@param {String} message)   The error message to be passed along.
 * @function  detail  (@param {String} detail)    Detailed description of the error.
 * @function  status  (@param {Number} status)    HTML status codes.
 * @function  code    (@param {Number} code)      Error code to be used.
 * @function  data    (@param {Object} data)      This is an open field to pass data along that might be relevant.
 *
 * -----------------------------------------------------------------------------
 *
 * CustomErrors will be utilised by the following hierarchical implementations:
 * - html: These are general HTML errors such as NotFound, Unauthorised etc.
 *  - specific: There utilize either HTML custom errors or are completely application specific.
 *  e.g. user.NotFound is a specific implementation of the html.NotFound class.
 */

debug('Defining class: CustomError');
var CustomError = function(message = null){
  this._message = message || null;
  this._detail = null;
  this._status = null;
  this._code = null;
  this._data = null;

  return this;
};

debug('Adding monadic prototype method: message');
CustomError.prototype.message = function(message){
  this._message = message || null;
  return this;
};

debug('Adding monadic prototype method: detail');
CustomError.prototype.detail = function(detail){
  this._detail = detail || null;
  return this;
};

debug('Adding monadic prototype method: status');
CustomError.prototype.status = function(status){
  this._status = status || null;
  return this;
};

debug('Adding monadic prototype method: code');
CustomError.prototype.code = function(code){
  this._code = code || null;
  return this;
};

debug('Adding monadic prototype method: data');
CustomError.prototype.data = function(data){
  this._data = data || null;

  if(typeof this._data !== 'object'){
    var msg = `Invalid parameter for 'data': ${this.data}`;
    throw new Error(msg);
  }

  return this;
};

debug('Adding prototype method: getMessage');
CustomError.prototype.getMessage = function(){
  return this._message;
};

debug('Adding prototype method: getDetail');
CustomError.prototype.getDetail = function(){
  return this._detail;
};

debug('Adding prototype method: getStatus');
CustomError.prototype.getStatus = function(){
  return this._status;
};

debug('Adding prototype method: getCode');
CustomError.prototype.getCode = function(){
  return this._code;
};

debug('Adding prototype method: getData');
CustomError.prototype.getData = function(){
  return this._data;
};

debug('Adding prototype method: getData');
CustomError.prototype.getData = function(key){
  if(typeof key === 'undefined' || key !== null) return this._data;
  else {
    return (this._data.hasOwnProperty(key)) ? this._data[key] : null;
  }
};

debug('Exporting class: CustomError');
module.exports = CustomError;
