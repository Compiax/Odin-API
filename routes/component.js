/**
 * Contains all the routes that deal with components
 */

var component = require('../controllers/component')
var debug     = require('debug')('odin-api:routes:component');
var express   = require('express');

var router = express.Router();

debug("Adding /create route");
router.post('/create', component.create);

debug("Adding DELETE /:id route");
router.delete('/:id', component.Delete);

debug('Adding GET / route');
router.get('/', component.list); //lists all components in the db

debug('Adding/update route');
router.patch('/', component.patch)

debug('Component router exported');
module.exports = router;
