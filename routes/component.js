/**
 * Contains all the routes that deal with components
 */

var component = require('../controllers/component')
var debug     = require('debug')('odin-api:routes:component');
var express   = require('express');
var auth      = require('../controllers/auth');

var router = express.Router();

debug("Adding POST /");
router.post('/', auth.isLoggedIn, component.create);

debug("Adding DELETE /:id");
router.delete('/:id', auth.isLoggedIn, component.delete);

debug('Adding GET /');
router.get('/', auth.isLoggedIn, component.browse);

debug('Adding GET /');
router.get('/:id', auth.isLoggedIn, component.read);

debug('Adding PATCH /');
router.patch('/:id', auth.isLoggedIn, component.update)

debug('Component router exported');
module.exports = router;
