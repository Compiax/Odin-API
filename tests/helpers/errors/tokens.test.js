var assert    = require('assert');
var errors    = require('../../../helpers/errors');
var should    = require('should');

// Typedefs for easier usage.
var NotFoundError = errors.html._4xx.NotFoundError;
var TokenNotFoundError = errors.tokens.TokenNotFoundError;

module.exports.test = function(){
  describe('tokens =>', function() {
    describe('TokenNotFoundError =>', function() {
      var err = new TokenNotFoundError();

      describe('instance =>', function() {
        it('should be a concrete implementation of: NotFoundError', function() {
          assert.equal(err instanceof NotFoundError, true);
        });

        it('should be an instance of: TokenNotFoundError', function() {
          assert.equal(err instanceof TokenNotFoundError, true);
        });
      });

      describe('properties =>', function() {
        describe('_message =>', function() {
          it('should be: "Not found."', function() {
            err.should.have.property('_message', 'Not found.');
          });
        });

        describe('_detail =>', function() {
          it('should be: "Not implemented yet."', function() {
            err.should.have.property('_detail', 'Token not found.');
          });
        });

        describe('_status =>', function() {
          it('should be: 404', function() {
            err.should.have.property('_status', 404);
          });
        });
      });
    });
  });
};
