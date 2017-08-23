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
// Checks if logged in -> Responds with specific users information
router.get('/:id', auth.isLoggedIn, users.read);

debug("Added route: PATCH /");
// Checks if logged in -> Validate -> Updates and responds
router.patch('/:id', auth.isLoggedIn, users.validateUpdate, users.update);

debug('Users router exported');
module.exports = router;
