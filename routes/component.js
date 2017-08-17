/**
 * Contains all the routes that deal with components
 */

var component = require('../controllers/component')
var debug     = require('debug')('odin-api:routes:component');
var express   = require('express');

var router = express.Router();

debug("Adding /create route");
router.post('/create', component.create);

debug('Adding /list route');
router.post('/list', component.list); //lists all components in the db

debug('Component router exported');
module.exports = router;