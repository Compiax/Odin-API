/**
 * Contains all the authentication routes: login, logout, register
 * Pipeline: validate, authenticate, process request and respond
 */

var auth = require('../controllers/auth')
var debug     = require('debug')('odin-api:routes:auth');
var express   = require('express');


var router = express.Router();

debug("Adding /login route");
// Validates query -> Checks if user is already logged in -> logs in
router.post('/login', auth.validateLogin, auth.login);

debug("Adding /register route");
// Validates query -> Checks if user is already logged in -> registers
router.post('/register', auth.validateRegistration, auth.register);

debug("Adding /logout route");
// Validates query -> Checks if user is not logged in -> logs out
router.post('/logout', auth.isLoggedIn, auth.logout);

debug('Auth router exported');
module.exports = router;