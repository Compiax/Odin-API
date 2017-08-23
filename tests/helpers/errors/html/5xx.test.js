var assert    = require('assert');
var errors    = require('../../../../helpers/errors');
var should    = require('should');

// Typedefs for easier usage.
var CustomError = errors.CustomError;
var InternalServerError = errors.html._5xx.InternalServerError;

module.exports.test = function(){
  describe('5xx =>', function() {
    describe('InternalServerError =>', function() {
      var err = new InternalServerError('Custom detail.');

      describe('instance =>', function() {
        it('should be an instance of: InternalServerError', function() {
          assert.equal(err instanceof InternalServerError, true);
        });
      });

      describe('properties =>', function() {
        describe('_message =>', function() {
          it('should be: "Internal server error."', function() {
            err.should.have.property('_message', 'Internal server error.');
          });
        });

        describe('_detail =>', function() {
          it('should be: "Custom detail."', function() {
            err.should.have.property('_detail', 'Custom detail.');
          });
        });

        describe('_status =>', function() {
          it('should be: 500', function() {
            err.should.have.property('_status', 500);
          });
        });
      });
    });
  });
};
