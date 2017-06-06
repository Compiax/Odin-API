var errors        = require('./errors');
// var validation    = require('./validation');

module.exports.test = function(){
  describe('helpers =>', function() {
    errors.test();
    // validation.test();
  });
};
