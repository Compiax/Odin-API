var _             = require('lodash')
var debug         = require('debug')('odin-api:middleware:errors')
var errors        = require('../helpers/errors')
var express       = require('express')

// Typedef for easier usage.
var CustomError   = errors.CustomError

debug('Defining error handler')
module.exports = function(err, req, res, next){
  debug(err)
  /**
   * Error handler for custom errors.
   */
  if(err instanceof CustomError){
    /**
     * @TODO: Surely this can be done better right?
     * @PRIORITY: HIGH
     */
    var data = err.getData() || null
    var status = err.getStatus()
    var meta = _.clone(data) || null

    if(typeof meta !== 'undefined' && meta !== null){
      if(meta.hasOwnProperty('id')) delete meta.id
      if(meta.hasOwnProperty('links')) delete meta.links
      if(meta.hasOwnProperty('source')) delete meta.source
    }

    var response = {
      id:       err.getData('id'),
      links:    err.getData('links'),
      status:   status,
      code:     err.getCode(),
      title:    err.getMessage(),
      detail:   err.getDetail(),
      source:   err.getData('source'),
      meta:     meta
    }

    response = _.omitBy(response, _.isNil)

    if(typeof status !== 'undefined' && status !== null){
      res.status(status)
    }

    return res.send(response)
  }
  else{
    var response = {
      errors: [
        {
          status: 500,
          title: 'Internal server error.'
        }
      ]
    }

    return res.status(500).send(response)
  }
}
