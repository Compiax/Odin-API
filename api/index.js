var auth        = require('./auth')
var _           = require('lodash')
var Pipeline    = require('../utils/pipeline.js')
var users       = require('./users')
var components  = require('./components')
var projects    = require('./projects')

var http = controllers => {
    return (req, res, next) => {
        var data = _.extend(req.body, req.params) || null
        var options = _.extend(req.query, {user: req.user}) || null

        new Pipeline(controllers)
            .start({data, options})
            .then((args) => res.send(data.response))
            .catch((err) => next(err))
    }
}

module.exports = { auth, projects, http, users, components }