var assert    = require('assert');
var errors    = require('../../../../helpers/errors');
var should    = require('should');

// Typedefs for easier usage.
var CustomError = errors.CustomError;
var ForbiddenError = errors.html._4xx.ForbiddenError;
var NotFoundError = errors.html._4xx.NotFoundError;
var UnauthorizedError = errors.html._4xx.UnauthorizedError;

module.exports.test = function(){
  describe('4xx =>', function() {
    describe('ForbiddenError =>', function() {
      var err = new ForbiddenError('Custom detail.');

      describe('instance =>', function() {
        it('should be an instance of: ForbiddenError', function() {
          assert.equal(err instanceof ForbiddenError, true);
        });
      });

      describe('properties =>', function() {
        describe('_message =>', function() {
          it('should be: "Forbidden."', function() {
            err.should.have.property('_message', 'Forbidden.');
          });
        });

        describe('_detail =>', function() {
          it('should be: "Custom detail."', function() {
            err.should.have.property('_detail', 'Custom detail.');
          });
        });

        describe('_status =>', function() {
          it('should be: 403', function() {
            err.should.have.property('_status', 403);
          });
        });
      });
    });

    describe('NotFoundError =>', function() {
      var err = new NotFoundError('Custom detail.');

      describe('instance =>', function() {
        it('should be an instance of: NotFoundError', function() {
          assert.equal(err instanceof NotFoundError, true);
        });
      });

      describe('properties =>', function() {
        describe('_message =>', function() {
          it('should be: "Not found."', function() {
            err.should.have.property('_message', 'Not found.');
          });
        });

        describe('_detail =>', function() {
          it('should be: "Custom detail."', function() {
            err.should.have.property('_detail', 'Custom detail.');
          });
        });

        describe('_status =>', function() {
          it('should be: 404', function() {
            err.should.have.property('_status', 404);
          });
        });
      });
    });

    describe('UnauthorizedError =>', function() {
      var err = new UnauthorizedError('Custom detail.');

      describe('instance =>', function() {
        it('should be an instance of: UnauthorizedError', function() {
          assert.equal(err instanceof UnauthorizedError, true);
        });
      });

      describe('properties =>', function() {
        describe('_message =>', function() {
          it('should be: "Unauthorized."', function() {
            err.should.have.property('_message', 'Unauthorized.');
          });
        });

        describe('_detail =>', function() {
          it('should be: "Custom detail."', function() {
            err.should.have.property('_detail', 'Custom detail.');
          });
        });

        describe('_status =>', function() {
          it('should be: 401', function() {
            err.should.have.property('_status', 401);
          });
        });
      });
    });
  });
};
