/**
 * Contains all the routes that deal with projects
 */

var debug     = require('debug')('odin-api:routes:project');
var express   = require('express');

var router = express.Router();

debug("Adding / route");
router.use('/', function(req, res, next) {
    next("Not implemented");
});

debug('Priject router exported');
module.exports = router;