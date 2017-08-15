/**
 * Contains all the routes that deal with users
 */

var auth      = require('../controllers/auth');
var debug     = require('debug')('odin-api:routes:user');
var express   = require('express');
var users     = require('../controllers/users');

var router = express.Router();

debug("Added route: GET /");
// Checks if logged in -> Responds with all users
router.get('/', auth.isLoggedIn, users.browse);

debug("Added route: GET /:username");
// Checks if logged in -> Responds specific users information
// @todo: Add validation
router.get('/:username', auth.isLoggedIn, users.read);

debug('Users router exported');
module.exports = router;