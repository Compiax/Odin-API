/**
 * Contains all the controllers that deal with sessions
 */

var debug           = require('debug')('odin-api:controllers:session');
var JsonAPIResponse = require('../helpers/jsonapiresponse');
var session         = require('../helpers/session');

debug('Adding controller: login');
module.exports.execute = function(req, res, next) {
    session.start();
    res.status(200).send("Success");
};