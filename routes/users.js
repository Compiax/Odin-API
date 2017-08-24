/**
 * Contains all the routes that deal with users
 */

var auth      = require('../controllers/auth');
var debug     = require('debug')('odin-api:routes:user');
var express   = require('express');
var users     = require('../controllers/users');

var router = express.Router();

debug("Added route: GET /");
router.get('/', auth.isLoggedIn, users.browse);

debug("Added route: GET /:id");
router.get('/:id', auth.isLoggedIn, users.read);

debug("Added route: PATCH /:id");
router.patch('/:id', auth.isLoggedIn, users.update);

debug("Added route: DE?ETE /:id");
router.delete('/:id', auth.isLoggedIn, users.delete);

debug('Users router exported');
module.exports = router;
