var debug       = require('debug')('odin-api:utils')
var pipeline    = require('./pipeline')

module.exports.pipeline = pipeline

module.exports = {
    pipeline: pipeline,
}