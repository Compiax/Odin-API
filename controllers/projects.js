var _               = require('lodash')
var Component       = require('../models/component')
var debug           = require('debug')('odin-api:controllers:project')
var IncorrectStructureError = require('../helpers/errors').session.IncorrectStructureError
var Project         = require('../models/project')
var ProjectNotFoundError = require('../helpers/errors').projects.ProjectNotFoundError
var session                 = require('../helpers/session')
var shortid                 = require('shortid')


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
 * Pipeline function to build a JSON:API response to describe a project or collection of projects
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
                // .link({author: `/projects/${project.owner.username}`})
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

/**
* Pipeline function to generate a component from a project
* Requires: project
*/
module.exports.generateComponent = (args) => {
    return new Promise((resolve, reject) => { 
        debug('Calling generateComponent()')
        _.forEach(['project', 'code', 'variables', 'numInputs'], key => {
            if (!_.has(args.data, key)) {
                return reject(`Missing field '${key}' in args.data`)
            }
        })
        debug(args.data.project)
        let component = new Component({
            name: args.data.project.name,
            description: args.data.project.description || '@todo: fill in',
            stats: {
                downloads: 0,
                stars: 0
            },
            variables: args.data.variables,
            code: args.data.code,
            author: args.options.user,
            usage: '@todo: fill in',
            created: new Date(),
            inputs: args.data.numInputs
        })
        debug(args.data.code)
        component.save()
            .then(component => {
                debug(component)
                return resolve(args)
            })
            .catch(err => {
                debug(err.errors)
                return reject(err)
            })
    })
}

/**
 * Checks the structure of the graph
 */
module.exports.check = (args) => {
    return new Promise((resolve, reject) => {
        debug('Calling check()')
        if (!_.has(args.data, 'nodes')) {
            return reject('Missing field \'nodes\' in args.data')
        }

        args.data.nodes = JSON.parse(args.data.nodes)

        // Check number of output nodes
        for (node of args.data.nodes) {
            if (node.type === 'Output') {
                if (!args.data.outputNode == null) {
                    return reject(new IncorrectStructureError("Can't have two output nodes."))
                }
                args.data.outputNode = node;
            }
        }
        if (args.data.outputNode == null) {
            return reject(new IncorrectStructureError('There needs to be an output node'))
        }

        // Could probably check more but whatever

        resolve(args)
    })    
}

/**
 * Save nodes
 */
module.exports.save = (args) => {
    return new Promise((resolve, reject) => {
        debug('Calling save()')
        args.data.project.data = JSON.stringify(args.data.nodes)
        _.extend(args.data.project, { data: JSON.stringify(args.data.nodes)}, args.data.newData)
        args.data.project.save()
        .then(project => {
            resolve(args)
        })
        .catch(err => {
            reject(args)
        })
    });
}

/**
 * Builds a DFS list of the graph
 */
module.exports.build = (args) => {
    return new Promise((resolve, reject) => {
        debug('Calling build()')
        _.forEach(['nodes', 'outputNode'], key => {
            if (!_.has(args.data, key)) {
                return reject(`Missing field '${key}' in args.data`)
            }
        })

        for (node of args.data.nodes) {
            if (node.variable && args.data.dimensions == null) {
                debug('using ' + args.data.dimensions)
                args.data.dimensions = node.variable.dimensions
                args.data.values = node.variable.values
                break
            }
        }

        let dict = {}
        args.data.nodes.forEach(n => dict[n.id] = n)
        
        args.data.tree = []
        dfs(args.data.outputNode, dict, args.data.tree)
        debug(args.data.tree)
        resolve(args)
    })    
}

module.exports.getVariables = (args) => {
    return new Promise((resolve, reject) => {
        debug('Calling getVariables()')
        _.forEach(['nodes'], key => {
            if (!_.has(args.data, key)) {
                return reject(`Missing field '${key}' in args.data`)
            }
        })

        let numInputs = 1
        args.data.variables = []
        shortid.characters('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ@#')
        const nodes = args.data.nodes
        for (node of nodes) {
            if (node.variable) {
                node.variable.name = `input-${numInputs++}`;
            } else if (node.child && node.child.type === 'Output') {
                node.variable = {name: 'result'}
            } else {
                node.variable = {name: shortid.generate()}
            }
            args.data.variables.push({ 
                name: node.variable.name, 
                dimensions: node.variable.dimensions || args.data.dimensions, 
                values: node.variable.values || args.data.values, 
                save: 0, 
                rank: (node.variable.dimensions || args.data.dimensions).length
            })
        }
        args.data.numInputs = numInputs - 1
        return resolve(args)
    })
}

module.exports.getOperations = (args) => {
    return new Promise((resolve, reject) => {
        debug('Calling getOperations()')
        let code = []
        let p = args.data.tree.map((node) => {
            return () => {
            return new Promise((go, stop) => {
                if (node.type == 'Component') {
                    let parentVars = node.parents.map(p => p.variable.name)
                    if (node.component.name === "Add") {
                        code.push(`SUM ${parentVars[0]} ${parentVars[1]} ${node.variable.name}`)
                        return go()
                    } else if (node.component.name === "Subtract") {
                        code.push(`SUB ${parentVars[0]} ${parentVars[1]} ${node.variable.name}`)
                        return go()
                    } else if (node.component.name === "Multiply") {
                        code.push(`MUL ${parentVars[0]} ${parentVars[1]} ${node.variable.name}`)
                        return go()
                    } else {
                        debug('Found custom component ' + node.component.id)
                        Component.findById(node.component.id)
                        .then(component => {
                            if (component == null) {
                                return reject('Could not find component')
                            }
                            let id = shortid.generate();
                            
                            // Generate embedded code
                            let theCode = component.code;
                            debug(theCode)
                            theCode = theCode.map(line => {
                                let newLine = line.split(' ')
                                let op = newLine.shift()
                                newLine = newLine.map(v => {
                                    if (v.includes('input')) {
                                        v = parseInt(v.split('-').splice(1,1))
                                        return parentVars[v-1]
                                    } else if (v == 'result') {
                                        return node.variable.name
                                    } else {
                                        return (id + v)
                                    }
                                })
                                return op + ' ' + newLine.join(' ');
                            })
                            code.push(...theCode)
                            debug(theCode)

                            let newVariables = component.variables.filter(v => (!v.name.includes('input') && v.name !== 'result'))
                                .map(v => {
                                    v.name = id + v.name;
                                    return v;
                                })
                            args.data.variables.push(...newVariables)
                            
                            // Generate embedded variables
                            debug(args.data.variables)
                            return go()
                        })
                        .catch(err => {
                            return reject(err)
                        })
                    }
                } else {
                    return go();
                }
                /*else {
                    // debug(`Unknown component ${node.author.username}/${node.component}`)
                    Component.findOne({name: node.component})
                    .then(component => {
                        let id = shortid.generate()
                        code.push(...generateEmbeddedCode(id, component, parentVars, node.var.name))
                        variables.push(...alterEmbeddedVariables(id, component, variables))
                        debug('finished ' + node.component)
                        return go()
                    })
                    .catch(err => {
                        debug(err)
                    })
                }*/
            })
        }})
        queue(p).then(() => {
            args.data.code = code
            return resolve(args)
        })
    });
}

module.exports.execute = (args) => {
    return new Promise((resolve, reject) => {
        session.start(args.data.variables, args.data.code)
        .then((answer) => {
            debug(answer)
            args.data.response = answer;
            resolve(args)
        })
    })
}

/**
 * Private functions, not controllers
 * @todo: Move to a different file sometime
 */
function dfs(node, nodes, list) {
    if (list == null) list = []
    node.parents = node.parents.map(p => nodes[p])
    node.child = nodes[node.child]
    if (node.parents && node.parents.length > 0) {
        for (parent of node.parents) {
            // if (parent.type === 'Component') list.push(parent)
            dfs(parent, nodes, list)
        }
        if (node.type === 'Component') list.push(node)
    }
}

function queue(all) {
    return new Promise((resolve, reject) => {
        next(all.shift())        
        function next(go) {
            go()
            .then(res => {
                if (all.length == 0) {
                    return resolve()
                }
                next(all.shift());
            })
        }
    })
}