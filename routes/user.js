/**
 * Contains all the routes that deal with users
 */

var debug     = require('debug')('odin-api:routes:user');
var express   = require('express');

var router = express.Router();

debug("Adding / route");
router.use('/', function(req, res, next) {
    next("Not implemented");
});

debug('Users router exported');
module.exports = router;