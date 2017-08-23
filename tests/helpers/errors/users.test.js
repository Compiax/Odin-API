var assert    = require('assert');
var errors    = require('../../../helpers/errors');
var should    = require('should');

// Typedefs for easier usage.
var NotFoundError = errors.html._4xx.NotFoundError;
var UserNotFoundError = errors.users.UserNotFoundError;
var UsersNotFoundError = errors.users.UsersNotFoundError;

module.exports.test = function(){
  describe('users =>', function() {
    describe('UserNotFoundError =>', function() {
      var err = new UserNotFoundError();

      describe('instance =>', function() {
        it('should be a concrete implementation of: NotFoundError', function() {
          assert.equal(err instanceof NotFoundError, true);
        });

        it('should be an instance of: UserNotFoundError', function() {
          assert.equal(err instanceof UserNotFoundError, true);
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
            err.should.have.property('_detail', 'User not found.');
          });
        });

        describe('_status =>', function() {
          it('should be: 404', function() {
            err.should.have.property('_status', 404);
          });
        });
      });
    });

    describe('UsersNotFoundError =>', function() {
      var err = new UsersNotFoundError();

      describe('instance =>', function() {
        it('should be a concrete implementation of: NotFoundError', function() {
          assert.equal(err instanceof NotFoundError, true);
        });

        it('should be an instance of: UsersNotFoundError', function() {
          assert.equal(err instanceof UsersNotFoundError, true);
        });
      });

      describe('properties =>', function() {
        describe('_message =>', function() {
          it('should be: "Not found."', function() {
            err.should.have.property('_message', 'Not found.');
          });
        });

        describe('_detail =>', function() {
          it('should be: "Users not found."', function() {
            err.should.have.property('_detail', 'Users not found.');
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
