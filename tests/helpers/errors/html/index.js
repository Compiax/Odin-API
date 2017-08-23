var _4xx    = require('./4xx.test');
var _5xx    = require('./5xx.test');

module.exports.test = function(){
  describe('html =>', function() {
    _4xx.test();
    _5xx.test();
  });
};
