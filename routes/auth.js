var auth      = require('../controllers/auth');
var debug     = require('debug')('odin-api:routes:auth');
var express   = require('express');

var router = express.Router();

debug('Adding route: GET /auth/check');
router.get('/check', auth.check);

debug('Adding route: POST /auth/register');
router.post('/register', auth.isNotAuthenticated, auth.register);

debug('Adding route: POST /auth/login');
router.post('/login', auth.isNotAuthenticated, auth.login);

debug('Adding route: POST /auth/logout');
router.post('/logout', auth.isAuthenticated, auth.logout);

debug('Adding route: POST /auth/verify');
router.post('/verify', auth.isNotAuthenticated, auth.verify);

debug('Adding route: POST /auth/forgot');
router.post('/forgot', auth.isNotAuthenticated, auth.forgot);

debug('Adding route: POST /auth/reset');
router.post('/reset', auth.isNotAuthenticated, auth.reset);

debug('Auth router exported');
module.exports = router;
