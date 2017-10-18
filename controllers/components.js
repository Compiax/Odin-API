var _                       = require('lodash')
var debug                   = require('debug')('odin-api:controllers:component')
var Component               = require('../models/component')
var ComponentNotFoundError  = require('../helpers/errors').components.ComponentNotFoundError

/**
 * Pipeline function to save a component to the database.
 * Requires: name, description, usage
 * Adds: component
 */
module.exports.create = (args) => {
    return new Promise((resolve, reject) => { 
        debug("Calling create() controller")
        
        // Check if it contains the correct fields
        _.forEach(['name', 'description', 'usage'], key => {
            if (!_.has(args.data, key)) {
                return reject(`Missing field '${key}' in args.data`)
            }
        })

        let attributes = _.extend(args.data, {author: args.options.user})
        Component.create(attributes)
            .then(component => {
                args.data.component = component
                return resolve(args)
            })
            .catch(err => {
                return reject(err)
            })
    })
}

/**
 * Pipeline function to build a JSON:API response to descripe a component or collection of components
 * Requires: component or components
 * Adds: response
 */
module.exports.buildResponse = (args) => {
    return new Promise((resolve, reject) => {
        debug("Calling buildResponse() controller")
        let components = null
        if (_.has(args.data, 'component')) {
            components = [args.data.component]
        } else if (_.has(args.data, 'components')) {
            components = args.data.components
        }
        
        const response = new JsonAPIResponse()
        _.forEach(components, component => {
            response.addData('component')
                .id(component._id)
                .attribute(component.attributes())
        })

        args.data.response = response
        return resolve(args)
    })
}

/**
 * Pipeline function to fetch a single component by ID
 * Requires: componentID
 * Adds: component
 */
module.exports.find = (args) => {
    return new Promise((resolve, reject) => { 
        debug("Calling find() controller")

        if (!_.has(args.data, 'componentID')) {
            return reject('Missing field \'componentID\' in args.data')
        }

        Component.findById(args.data.componentID)
            .populate('author')
            .then(component => {
                if (!component) {
                    return reject(new ComponentNotFoundError())
                }
                args.data.component = component
                return resolve(args)
            })
            .catch(err => {
                return reject(err)
            })
    })
}

/**
 * Pipeline function to fetch all components
 * Adds: components
 */
module.exports.browse = (args) => {
    return new Promise((resolve, reject) => { 
        debug("Calling browse() controller")

        Component.find()
            .populate('author')
            .then(components => {
                args.data.components = components
                return resolve(args)
            })
            .catch(err => {
                return reject(err)
            })
    })
}

/**
 * Pipeline function to add math components
 * Requires: components
 */
module.exports.addBaseComponents = (args) => {
    return new Promise((resolve, reject) => {
        debug('Calling addBaseComponents() controller')

        if (!_.has(args.data, 'components')) {
            return reject('Missing field \'components\' in args.data')
        }

        let attributes = function() {
            return {
                name: this.name,
                description: this.description,
                author: {
                    username: 'Math'
                },
                inputs: 2
            }
        }

        args.data.components.push({
            _id: "NoIDYet",
            name: 'Add',
            description: 'Adds two tensors',
            attributes: attributes
        },
        {
            _id: "NoIDYet",
            name: 'Subtract',
            description: 'Subtracts two tensors',
            attributes: attributes
        },
        {
            _id: "NoIDYet",
            name: 'Divide',
            description: 'Divides two tensors',
            attributes: attributes
        },
        {
            _id: "NoIDYet",
            name: 'Multiply',
            description: 'Multiplies two tensors',
            attributes: attributes
        })

        return resolve(args)        
    })
}

/**
 * Pipeline function to update a component
 * Requires: component
 * Adds: component
 */
module.exports.update = (args) => {
    return new Promise((resolve, reject) => { 
        debug("Calling update() controller")

        if (!_.has(args.data, 'component')) {
            return reject('Missing field \'component\' in args.data')
        }

        let component = _.extend(args.data.component, args.data)
        component.save().then(component => {
            args.data.component = component
            return resolve(args)
        })
        .catch(err => {
            return reject(err)
        })
    })
}



/**
* Pipeline function to delete a component
* Requires: component
*/
module.exports.destroy = (args) => {
    return new Promise((resolve, reject) => { 
        debug("Calling delete() controller")

        if (!_.has(args.data, 'component')) {
            return reject('Missing field \'component\' in args.data')
        }
        args.data.component.remove()
        .then(component => {
            args.data.response = "OK"
            args.data.component = component
            return resolve(args)
        })
        .catch(err => {
            return reject(err)
        })
    })
}


/**
* Pipeline function to retrieve user components
* Requires:UserID
* Returns all components owned by user with UserID
*/

 module.exports.getByUser = (args) => {
    return new Promise((resolve, reject) => { 
        debug("Calling getByUser() controller")

         if (!_.has(args.data, 'userID')) 
            return reject('Missing userID in args.data')

        Component.find({author: {$elemMatch: {ObjectID : args.data.userID.toString()}}})
            .populate('author')
            .then( components => {
                args.data.components = components
                return resolve(args)
            })
        .catch(err => {
            return reject(err)
        })
    })
}



/**
* Pipeline function search for components (exported projects)
* Requires: Search String
* Returns all components with attributes to match the search string
*/

 module.exports.search = (args) => {
    return new Promise((resolve, reject) => { 
        debug("Calling search() controller")
       
         if (!_.has(args.data, 'searchString')) 
            return reject('Missing searchString in args.data')
            
        Component.createIndex({ "$**" : "text" })
        Component.find({ $text: { $search: args.data.searchString.toString()}})
            .populate('author')
            .then(components => {
                args.data.components = components
                return resolve(args)
            }) 
        .catch(err => {
            return reject(err)
        })
    })
}

