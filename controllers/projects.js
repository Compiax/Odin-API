var _       = require('lodash')
var debug   = require('debug')('odin-api:controllers:project')
var Project     = require('../models/project')
var ProjectNotFoundError = require('../helpers/errors').projects.ProjectNotFoundError

/**
 * Pipeline function to save a project to the database.
 * Requires: name, description, usage
 * Adds: project
 */
module.exports.create = (args) => {
    return new Promise((resolve, reject) => { 
        debug("Calling create() controller")
        
        // Check if it contains the correct fields
        _.forEach(['name', 'description'], key => {
            if (!_.has(args.data, key)) {
                return reject(`Missing field '${key}' in args.data`)
            }
        })

        let attributes = _.extend(args.data, {owner: args.options.user})

        Project.create(attributes)
            .then(project => {
                args.data.project = project
                return resolve(args)
            })
            .catch(err => {
                return reject(err)
            })
    })
}

/**
 * Pipeline function to build a JSON:API response to descripe a project or collection of projects
 * Requires: project or projects
 * Adds: response
 */
module.exports.buildResponse = (args) => {
    return new Promise((resolve, reject) => {
        debug("Calling buildResponse() controller")
        let projects = null
        if (_.has(args.data, 'project')) {
            projects = [args.data.project]
        } else if (_.has(args.data, 'projects')) {
            projects = args.data.projects
        }
        
        const response = new JsonAPIResponse()
        _.forEach(projects, project => {
            response.addData('project')
                .id(project._id)
                .attribute(project.attributes())
                .link({self: `/projects/${project._id}`})
                .link({author: `/projects/${project.owner.username}`})
        })

        args.data.response = response
        return resolve(args)
    })
}

/**
 * Pipeline function to fetch a single project by ID
 * Requires: projectID
 * Adds: project
 */
module.exports.find = (args) => {
    return new Promise((resolve, reject) => { 
        debug("Calling find() controller")

        if (!_.has(args.data, 'projectID')) {
            return reject('Missing field \'projectID\' in args.data')
        }

        Project.findById(args.data.projectID)
            .populate('owner')
            .then(project => {
                if (!project) {
                    return reject(new ProjectNotFoundError())
                }
                args.data.project = project
                return resolve(args)
            })
            .catch(err => {
                return reject(err)
            })
    })
}

/**
 * Pipeline function to fetch all projects
 * Adds: projects
 */
module.exports.browse = (args) => {
    return new Promise((resolve, reject) => { 
        debug("Calling browse() controller")

        Project.find()
            .populate('owner')
            .then(projects => {
                args.data.projects = projects
                return resolve(args)
            })
            .catch(err => {
                return reject(err)
            })
    })
}

/**
 * Pipeline function to update a project
 * Requires: project
 * Adds: project
 */
module.exports.update = (args) => {
    return new Promise((resolve, reject) => { 
        debug("Calling update() controller")

        if (!_.has(args.data, 'project')) {
            return reject('Missing field \'project\' in args.data')
        }

        let project = _.extend(args.data.project, args.data)

        project.save().then(project => {
            args.data.project = project
            return resolve(args)
        })
        .catch(err => {
            return reject(err)
        })
    })
}

/**
* Pipeline function to delete a project
* Requires: project
*/
module.exports.destroy = (args) => {
    return new Promise((resolve, reject) => { 
        debug("Calling delete() controller")

        if (!_.has(args.data, 'project')) {
            return reject('Missing field \'project\' in args.data')
        }
        args.data.project.remove()
        .then(project => {
            args.data.response = "OK"
            args.data.project = project
            return resolve(args)
        })
        .catch(err => {
            return reject(err)
        })
    })
}