/**
 * Contains all the authentication routes: login, logout, register
 */

var auth = require('../controllers/auth')
var debug     = require('debug')('odin-api:routes:auth');
var express   = require('express');

var router = express.Router();

debug("Adding / route");
router.use('/', function(req, res, next) {
    // @todo: Make a better 404 error
    next("404 Not Found");
});

debug("Adding /login route");
router.use('/login', auth.login);

debug("Adding /register route");
router.use('/register', auth.register);

debug("Adding /logout route");
router.use('/logout', auth.logout);

debug('Auth router exported');
module.exports = router;