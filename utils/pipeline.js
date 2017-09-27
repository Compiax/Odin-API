let _         = require('lodash')
var debug     = require('debug')('odin-api:utils:pipeline')
let Promise   = require('bluebird')

/**
 * The pipeline object is essentially a Promise object with chained "then"
 * functions, which each returns another Promise so that the chain can continue.
 *
 * Note:
 * - Order of functions matter.
 * - There is no default catch added. It is left to the user to decide what to
 *   do with the resulting Promise.
 */
module.exports = class Pipeline{
  constructor(promises){
    this.pipe = null

    if(!Array.isArray(promises)){
      throw new Error("Pipeline: Invalid parameters type, expecting promises array.")
    }

    this.promises = promises
  }

  start(args){
    this.pipe = Promise.resolve(args)

    // Chain next "then" call as newest version of pipeline Promise.
    _.forEach(this.promises, (promise, key) => {
        debug(".")
      this.pipe = this.pipe.then(promise)
    })

    // Finally return pipe as the resulting Promise.
    return this.pipe
  }
}
