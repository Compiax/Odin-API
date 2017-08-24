/**
 * Contains all the routes that deal with sessions
 */

var debug     = require('debug')('odin-api:routes:session');
var express   = require('express');
var session   = require('../controllers/session');  

var router = express.Router();

debug("Adding POST /execute route");
router.post('/execute', session.execute);

debug('Session router exported');
module.exports = router;