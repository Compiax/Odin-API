// var assert    = require('assert');
// var errors    = require('../../../helpers/errors');
// var should    = require('should');
//
// // Typedefs for easier usage.
// var InternalServerError = errors.html._5xx.InternalServerError;
// var NotImplementedError = errors.general.NotImplementedError;
//
// module.exports.test = function(){
//   describe('general =>', function() {
//     describe('NotImplementedError =>', function() {
//       var err = new NotImplementedError();
//
//       describe('instance =>', function() {
//         it('should be a concrete implementation of: InternalServerError', function() {
//           assert.equal(err instanceof InternalServerError, true);
//         });
//
//         it('should be an instance of: NotImplementedError', function() {
//           assert.equal(err instanceof NotImplementedError, true);
//         });
//       });
//
//       describe('properties =>', function() {
//         describe('_message =>', function() {
//           it('should be: "Internal server error."', function() {
//             err.should.have.property('_message', 'Internal server error.');
//           });
//         });
//
//         describe('_detail =>', function() {
//           it('should be: "Not implemented yet."', function() {
//             err.should.have.property('_detail', 'Not implemented yet.');
//           });
//         });
//
//         describe('_status =>', function() {
//           it('should be: 500', function() {
//             err.should.have.property('_status', 500);
//           });
//         });
//       });
//     });
//   });
// };
