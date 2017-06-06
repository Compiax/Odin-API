var assert    = require('assert');
var errors    = require('../../../helpers/errors');
var should    = require('should');

// Typedefs for easier usage.
var CustomError = errors.CustomError;

module.exports.test = function(){
  describe('custom =>', function() {
    describe('CustomError =>', function() {
      var err = new CustomError()
        .message('Custom message.')
        .detail('Custom detail.')
        .status(999)
        .code('0xFFF')
        .data({
          field1: 'value1'
        });

      describe('instance =>', function() {
        it('should be an instance of: CustomError', function() {
          assert.equal(err instanceof CustomError, true);
        });
      });

      describe('properties =>', function() {
        describe('_message =>', function() {
          it('should be: "Custom message."', function() {
            err.should.have.property('_message', 'Custom message.');
          });
        });

        describe('_detail =>', function() {
          it('should be: "Custom detail."', function() {
            err.should.have.property('_detail', 'Custom detail.');
          });
        });

        describe('_status =>', function() {
          it('should be: 999.', function() {
            err.should.have.property('_status', 999);
          });
        });

        describe('_code =>', function() {
          it('should be: "0xFFF".', function() {
            err.should.have.property('_code', '0xFFF');
          });
        });

        describe('_data =>', function() {
          it('should be: {field1: "value1"}.', function() {
            err.should.have.property('_data', {field1: 'value1'});
          });
        });
      });

      describe('methods =>', function() {
        describe('#getMessage()', function() {
          it('should return: "Custom message."', function() {
            assert.equal(err.getMessage(), 'Custom message.');
          });
        });

        describe('#getDetail() =>', function() {
          it('should return: "Custom detail."', function() {
            assert.equal(err.getDetail(), 'Custom detail.');
          });
        });

        describe('#getStatus() =>', function() {
          it('should return: 999', function() {
            assert.equal(err.getStatus(), 999);
          });
        });

        describe('#getCode() =>', function() {
          it('should return: "0xFFF."', function() {
            assert.equal(err.getCode(), '0xFFF');
          });
        });

        describe('#getData() =>', function() {
          it('should return: {field1: "value1"}', function() {
            assert.deepEqual(err.getData(), {field1: "value1"});
          });
        });
      });
    });
  });
};
