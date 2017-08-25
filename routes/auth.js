var auth = require('../controllers/auth')
var debug     = require('debug')('odin-api:routes:auth');
var express   = require('express');


var router = express.Router();

debug("Adding /login route");
router.post('/login', auth.validateLogin, auth.login);

debug("Adding /register route");
router.post('/register', auth.validateRegistration, auth.register);

debug("Adding /logout route");
router.post('/logout', auth.isLoggedIn, auth.logout);

router.post('/loggedIn', auth.isLoggedIn, (req, res) => {
    res.send(req.user);
})

debug('Auth router exported');
module.exports = router;
