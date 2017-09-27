var _                       = require("lodash")
var debug                   = require('debug')('odin-api:controllers:auth')
var errors                  = require('../helpers/errors')
var JsonAPIResponse         = require('../helpers/jsonapiresponse')
var passport                = require('passport')

// Type definitions
var UnauthorizedError       = errors.general.UnauthorizedError
var UserAlreadyExistsError  = errors.users.UserAlreadyExistsError
var WrongCredentialsError   = errors.auth.WrongCredentialsError
var BadRequestError         = errors.general.BadRequestError

/**
 * Middleware function to log the user in
 * Didn't use the pipeline architecture for this as access to the request object is needed.
 */
module.exports.login = (req, res, next) => {
    debug('Calling middleware function register()')
    // Check if correct fields are in req.body
    _.forEach(['username', 'password', 'email'], key => {
        if (!_.has(req.body, key)) {
            return reject(`Missing field '${key}' in req.body`)
        }
    })

    // This is ugly but that's because Passport is ugly
    passport.authenticate('local', (err, user, info) => {
        if (err) return next(err)
        if (!user) return next(new BadRequestError("Username or password is incorrect"))

        req.logIn(user, (err) => {
            if (err) return next(err)

            let response = new JsonAPIResponse()
            response.addData('user')
                .id(user._id)
                .attribute(user.attributes())
                .link({self: `/users/${user.username}`})
            return res.status(200).json(response.toJSON()).send()
        })
    })(req, res, next)
}

/**
 * Middleware function to log the user out.
 * Didn't use the pipeline architecture for this as access to the request object is needed.
 */
module.exports.logout = (req, res, next) => {
    debug('Calling middleware function logout()')
    if (req.user)
        debug(`Destroying session for ${req.user.username}`)
    else
        debug("Noone is logged in")
    req.logout()
    res.status(204).send()
}
    
/**
 * Middleware function to check if the user is logged in.
 * Didn't use the pipeline architecture for this as access to the request object is needed.
 */
module.exports.authenticate = (req, res, next) => {
    debug('Calling middleware function login()')
    if (req.isAuthenticated()) {
        let response = new JsonAPIResponse()
        response.addData('user')
            .id(req.user_id)
            .attribute(req.user.attributes())
            .link({self: `/users/${req.user.username}`})
        return res.status(200).json(response.toJSON()).send()
    } else {
        return next(new UnauthorizedError())
    }
}

debug('Auth controllers exported')
