var assert    = require('assert');
var errors    = require('../../../helpers/errors');
var should    = require('should');

// Typedefs for easier usage.
var AuthenticatedError = errors.auth.AuthenticatedError;
var ForbiddenError = errors.html._4xx.ForbiddenError;
var InvalidCredentialsError = errors.auth.InvalidCredentialsError;
var NotAuthenticatedError = errors.auth.NotAuthenticatedError;
var UnauthorizedError = errors.html._4xx.UnauthorizedError;

module.exports.test = function(){
  describe('auth =>', function() {
    describe('AuthenticatedError =>', function() {
      var err = new AuthenticatedError();

      describe('instance =>', function() {
        it('should be a concrete implementation of: ForbiddenError', function() {
          assert.equal(err instanceof ForbiddenError, true);
        });

        it('should be an instance of: AuthenticatedError', function() {
          assert.equal(err instanceof AuthenticatedError, true);
        });
      });

      describe('properties => =>', function() {
        describe('_message =>', function() {
          it('should be: "Forbidden."', function() {
            err.should.have.property('_message', 'Forbidden.');
          });
        });

        describe('_detail =>', function() {
          it('should be: "Already authenticated."', function() {
            err.should.have.property('_detail', 'Already authenticated.');
          });
        });

        describe('_status =>', function() {
          it('should be: 403', function() {
            err.should.have.property('_status', 403);
          });
        });
      });
    });

    describe('InvalidCredentialsError =>', function() {
      var err = new InvalidCredentialsError();

      describe('instance =>', function() {
        it('should be a concrete implementation of: UnauthorizedError', function() {
          assert.equal(err instanceof UnauthorizedError, true);
        });

        it('should be an instance of: InvalidCredentialsError', function() {
          assert.equal(err instanceof InvalidCredentialsError, true);
        });
      });

      describe('properties =>', function() {
        describe('_message =>', function() {
          it('should be: "Unauthorized."', function() {
            err.should.have.property('_message', 'Unauthorized.');
          });
        });

        describe('_detail =>', function() {
          it('should be: "Invalid credentials."', function() {
            err.should.have.property('_detail', 'Invalid credentials.');
          });
        });

        describe('_status =>', function() {
          it('should be: 401', function() {
            err.should.have.property('_status', 401);
          });
        });
      });
    });

    describe('NotAuthenticatedError =>', function() {
      var err = new NotAuthenticatedError();

      describe('instance =>', function() {
        it('should be a concrete implementation of: UnauthorizedError', function() {
          assert.equal(err instanceof UnauthorizedError, true);
        });

        it('should be an instance of: NotAuthenticatedError', function() {
          assert.equal(err instanceof NotAuthenticatedError, true);
        });
      });

      describe('properties =>', function() {
        describe('_message =>', function() {
          it('should be: "Unauthorized."', function() {
            err.should.have.property('_message', 'Unauthorized.');
          });
        });

        describe('_detail =>', function() {
          it('should be: "Not authenticated."', function() {
            err.should.have.property('_detail', 'Not authenticated.');
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
