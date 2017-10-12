var debug                   = require('debug')('odin-api:controllers:session')
var session                 = require('../helpers/session')
var _                       = require('lodash')
var IncorrectStructureError = require('../helpers/errors').session.IncorrectStructureError
var shortid                 = require('shortid')
var session                 = require('../helpers/session')
var Component               = require('../models/component')

/**
 * Pipeline function to execute the project
 * @todo: Rewrite all of this to work properly
 */
module.exports.execute = (args) => {
    return new Promise((resolve, reject) => { 
        debug("Calling execute() controller")
        if (!_.has(args.data, 'code')) {
            return reject('Missing field \'code\' in args.data')
        }
        if (!_.has(args.data, 'variables')) {
            return reject('Missing field \'variables\' in args.data')
        }

        let nodes = args.data.nodes
        // for (n of nodes) {
        //     printNode(n)
        // }
        // debug(nodes)
        session.start(args.data.variables, args.data.code)
            .then((answer) => {
                debug(answer)
                args.data.response = answer;
                resolve(args)
            })
    })
}

module.exports.generateCode = (args) => {
    return new Promise((resolve, reject) => {
        if (!_.has(args.data, 'nodes')) {
            return reject('Missing field \'nodes\' in args.data')
        }
        if (!_.has(args.data, 'project')) {
            return reject('Missing field \'project\' in args.data')
        }        
    
        let nodes = args.data.nodes
    
        buildTree(args.data.outputNode, nodes)
        defineVariables(nodes)
    
        let list = dfs(args.data.outputNode)
        debug(list)

        let variables = getVariables(nodes)
        args.data.variables = variables
        getCode(list, variables)
        .then((code) => {
            debug('Finished')
            debug(code)            
            args.data.code = code
    
            let numInputs = 0
            _.forEach(variables, v => {
                if (v.name.includes('input')) numInputs++;
            });
            args.data.numInputs = numInputs;
            args.data.project.code = code
            args.data.project.variables = variables
            args.data.project.save()
                .then(() => {
                    return resolve(args)
                })
                .catch(err => {
                    debug(err.errors)
                    return reject(err)
                })
        })
     })    
}

/**
 * Pipeline function to check that the given nodes are correctly structured
 */
module.exports.check = (args) => {
    return new Promise((resolve, reject) => { 
        debug("Calling check() controller")
        
        _.forEach(args.data.nodes, node => {
            if (node.component === "Output" && node.author == "Base") {
                if (args.data.outputNode !== undefined) {
                    reject(new IncorrectStructureError("Can't have two output nodes."))
                }
                args.data.outputNode = node
            }
        })

        if (args.data.outputNode === undefined) {
            reject(new IncorrectStructureError("Need at least one output node."))
        }
        if (args.data.outputNode.edges.inputs.length > 1) {
            reject(new IncorrectStructureError("Output node cannot have more than one input."))
        } else if (args.data.outputNode.edges.inputs.length === 0) {
            reject(new IncorrectStructureError("Output node needs at least one input."))
        }

        resolve(args)
    })
}



/**
 * Builds the tree, setting the child of each node
 * Note: Each node can only have one child, but multiple parents.
 * Recursive.
 */
function buildTree(currentNode, nodes) {
    debug("Calling buildTree()")
    if (currentNode.parents === undefined) {
        currentNode.parents = []
    }
    _.forEach(nodes, node => {
        if (_.intersection(node.edges.outputs, currentNode.edges.inputs).length > 0 && node.id !== currentNode.id) {
            node.child = currentNode
            currentNode.parents.push(node)
            buildTree(node, nodes)
        }
    })
}

/**
 * Searches all the nodes and defines a variable for the output of each node
 */
function defineVariables(nodes) {
    debug("Calling defineVariables()")
    let inputNumber = 1
    shortid.characters('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ@#')
    _.forEach(nodes, node => {
        let values = []
        if (node.values) {
            values = node.values.map(i => parseInt(i, 10))
        } else {
            values = [1,1,1,1]
        }
        if (node.edges.outputs.length > 0) {
            node.var = { name: shortid.generate(), dimensions: [2,2], values: values, save: 0, rank: 2 }
            if (node.component === "Input") {
                node.var.name = `input-${inputNumber++}`
            }
        }
        if (node.child && node.child.component === "Output") {
            node.var.name = "result"
        }
    })
}

function printNode(node) {
    debug(`== ${node.component} ==`)
    debug(`-> Inputs: [${node.edges.inputs}]`)
    debug(`-> Outputs: [${node.edges.outputs}]`)
    if (node.child !== undefined) {
        debug(`-> Child: ${node.child.component}`)
    }
    if (node.parents !== undefined) {
        debug(`-> Parents: [${node.parents.map(p => p.component)}]`)
    }
    if (node.var !== undefined) {
        debug(`-> Variable: ${node.var.name}`)
    }
}

function getCode(list, variables) {
    return new Promise((resolve, reject) => {
        let code = []
        let p = list.map((node) => {
            return () => {
            return new Promise((go, stop) => {
                debug('doing ' + node.component)
                let parentVars = node.parents.map(p => p.var.name)
                debug(`Parent vars of ${node.component}: ${parentVars}`)
                if (node.component === "Add") {
                    code.push(`SUM ${parentVars[0]} ${parentVars[1]} ${node.var.name}`)
                    return go()
                } else if (node.component === "Subtract") {
                    code.push(`SUB ${parentVars[0]} ${parentVars[1]} ${node.var.name}`)
                    return go()
                } else if (node.component === "Multiply") {
                    code.push(`MUL ${parentVars[0]} ${parentVars[1]} ${node.var.name}`)
                    return go()
                } else {
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
                }
            })
        }})
        debug(p)
        queue(p).then(() => {
            resolve(code)
        })
    })
}

function queue(all) {
    return new Promise((resolve, reject) => {
      const output = [];
  
      next(all.shift())
      
    
      function next(go) {
          debug
          debug(typeof go)
        go()
        .then(res => {
          if (all.length == 0) {
            return resolve(output)
          }
  
          next(all.shift());
          debug(all)
        })
      }
    })
  }

function dfs(node, list) {
    if (!list) {
        list = []
    }
    if (node.parents) {
        for (var i = 0; i < node.parents.length; i++) {
            dfs(node.parents[i], list)
        }
        if (node.author !== 'Base') {
            debug('Pushing ' + node.component)
            list.push(node)
        }
        return list
    }
}

function generateEmbeddedCode(id, component, inputs, output) {
    let newCode = []
    for (line of component.code) {
        let newLine = []
        line = line.split(' ')
        let op = line[0]
        line.splice(0, 1)
        for (v of line) {
            if (v.includes('input')) {
                v = v.split('-').splice(1, 1)
                newLine.push(inputs[parseInt(v)-1])
            } else if (v === 'result') {
                newLine.push(output)
            } else {
                newLine.push(id + v)
            }
        }
        newCode.push(op + ' ' + newLine.join(' '))
    }
    return newCode
}

function alterEmbeddedVariables(id, component, variables) {
    let newVariables = []
    for (v of component.variables) {
        if (!v.name.includes('input') && v.name !== 'result') {
            v.name = id + v.name
            newVariables.push(v)
        }
    }
    return newVariables
}

function getVariables(nodes) {
    var variables = []
    _.forEach(nodes, n => {
        if (n.var) {
            variables.push(n.var)
        } 
    })
    return variables
} 