/**
 * Contains all the routes that deal with components
 */

var debug     = require('debug')('odin-api:routes:component');
var express   = require('express');

var router = express.Router();

debug("Adding / route");
router.use('/', function(req, res, next) {
    next("Not implemented");
});

debug('Component router exported');
module.exports = router;