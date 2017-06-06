var auth      = require('./auth');
var debug     = require('debug')('odin-api:routes');
var express   = require('express');
var users     = require('./users');

var router = express.Router();

debug('Adding routes');
router.use('/auth', auth);
router.use('/users', users);

debug('Main router exported');
module.exports = router;
