var auth      = require('../controllers/auth');
var debug     = require('debug')('odin-api:routes:users');
var express   = require('express');
var users     = require('../controllers/users');

var router = express.Router();

debug('Adding route: GET /');
router.get('/', auth.isAuthenticated, users.browse);

debug('Adding route: POST /');
router.post('/', auth.isAuthenticated, users.create);

debug('Adding route: GET /:id');
router.get('/:id', auth.isAuthenticated, users.read);

debug('Adding route: PATCH /:id');
router.patch('/:id', auth.isAuthenticated, users.update);

debug('Adding route: DELETE /:id');
router.delete('/:id', auth.isAuthenticated, users.delete);

debug('Users router exported');
module.exports = router;
