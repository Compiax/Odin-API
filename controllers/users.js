var _                       = require('lodash')
var debug                   = require('debug')('odin-api:controllers:users')
var errors                  = require('../helpers/errors')
var JsonAPIResponse         = require('../helpers/jsonapiresponse')
var User                    = require('../models/user')

// Type definitions
var UserNotFoundError       = errors.users.UserNotFoundError
var UserAlreadyExistsError  = errors.users.UserAlreadyExistsError

/**
 * Pipeline function to create a user.
 * Requires: username, password, email
 * Adds: user
 */
module.exports.create = (args) => {
    return new Promise((resolve, reject) => {     
        debug("Calling create() controller")
        User.create(args.data)
        .then(user => {
            args.data.user = user
            resolve(args)
        })
        .catch(err => {
            if (err.code === 11000) {
                reject(new UserAlreadyExistsError())
            } else {
                reject(err)
            }
        })
    })
}

/**
 * Pipeline function to build a JSON:API response
 * Requires: user or users
 * Adds: response
 */
module.exports.buildResponse = (args) => {
    return new Promise((resolve, reject) => {
        debug("Calling buildResponse() controller")
        if (_.has(args.data, 'user')) {
            // Response contains a single user
            let user = args.data.user
            var response = new JsonAPIResponse()
            response.addData('user')
                .id(user._id)
                .attribute(user.attributes())
                .link({self: `/users/${user.username}`})
            args.data.response = response
        } else if (_.has(args.data, 'users')) {
            // Response contains multiple users
            var response = new JsonAPIResponse()
            _.forEach(args.data.users, user => {
                response.addData('user')
                .id(user._id)
                .attribute(user.attributes())
                .link({self: `/users/${user.username}`})
            })
            args.data.response = response
        } else {
            // No users included
            return reject(new Error("Neither users not user was included in args.data"))
        }
        return resolve(args)
    })
}

/**
 * Pipeline function to fetch a list of users
 * Adds: users
 */
module.exports.browse = (args) => {
    return new Promise((resolve, reject) => {  
    var response = new JsonAPIResponse()
        User.find()
            .then(users => {
                args.data.users = users
                return resolve(args)
            })
            .catch(err => {
                return reject(err)
            })
    })
}

module.exports.find = {}

/**
 * Pipeline function to fetch a single user by their username
 * Requires: username
 * Adds: user
 */
module.exports.find.byUsername = (args) => {
    return new Promise((resolve, reject) => { 
        debug("Calling find() controller")

        if (!_.has(args.data, 'username')) {
            return reject('Missing field \'username\' in args.data')
        }

        User.findOne({username: args.data.username})
            .then(user => {
                if (!user) {
                    return reject(new UserNotFoundError())
                }
                args.data.user = user
                return resolve(args)
            })
            .catch(err => {
                return reject(err)
            })
    })
}

/**
 * Pipeline function to fetch a single user by their ObjectID
 * Requires: userID
 * Adds: user
 */
module.exports.find.byID = (args) => {
    return new Promise((resolve, reject) => { 
        debug("Calling find() controller")

        if (!_.has(args.data, 'userID')) {
            return reject('Missing field \'userID\' in args.data')
        }

        User.findById(args.data.userID)
            .then(user => {
                if (!user) {
                    return reject(new UserNotFoundError())
                }
                args.data.user = user
                return resolve(args)
            })
            .catch(err => {
                return reject(err)
            })
    })
}

/**
 * Pipeline function to update a user
 * Requires: user
 * Adds: user
 */
module.exports.update = (args) => {
    return new Promise((resolve, reject) => { 
        debug("Calling update() controller")

        if (!_.has(args.data, 'user')) {
            return reject('Missing field \'user\' in args.data')
        }

        let user = _.extend(args.data.user, args.data)
        user.save().then(user => {
            args.data.user = user
            return resolve(args)
        })
        .catch(err => {
            return reject(err)
        })
    })
}

/**
* Pipeline function to delete a user
* Requires: user
*/
module.exports.destroy = (args) => {
    return new Promise((resolve, reject) => { 
        debug("Calling delete() controller")

        if (!_.has(args.data, 'user')) {
            return reject('Missing field \'user\' in args.data')
        }
        args.data.user.remove()
        .then(user => {
            args.data.response = "OK"
            args.data.user = user
            return resolve(args)
        })
        .catch(err => {
            return reject(err)
        })
    })
}

debug('User controllers exported')
