var debug                   = require('debug')('odin-api:controllers:session')
var session                 = require('../helpers/session')
var _                       = require('lodash')
var IncorrectStructureError = require('../helpers/errors').session.IncorrectStructureError
var shortid                 = require('shortid')
var session                 = require('../helpers/session')

/**
 * Pipeline function to execute the project
 * @todo: Rewrite all of this to work properly
 */
module.exports.execute = (args) => {
    return new Promise((resolve, reject) => { 
        debug("Calling execute() controller")

        let nodes = args.data.nodes

        buildTree(args.data.outputNode, nodes)
        defineVariables(nodes)
        let code = []
        let variables = getVariables(nodes)
        getCode(args.data.outputNode, code)
        debug(code)
        debug(variables)

        session.setVariables(variables)
            .setOperations(code)
            .start()

        // _.forEach(nodes, node => {
        //     printNode(node)
        // })

        
        resolve(args)
        args.response = "OK"
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
        debug(args.data.outputNode)
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
    if (currentNode.parents === undefined) {
        currentNode.parents = []
    }
    debug("Calling buildTree()")
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
        if (node.edges.outputs.length > 0) {
            node.var = { name: shortid.generate(), dimensions: [2,2], values: [1,1,1,1], save: 0, rank: 2 }
        }
        if (node.child && node.child.component === "Output") {
            node.var.name = "return"
        }
        if (node.component === "Input") {
            node.var.name = `input-${inputNumber++}`
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

function getCode(node, code) {
    if (node.parents) {
        _.forEach(node.parents, parent => {
            getCode(parent, code)
        })
        let parentVars = node.parents.map(p => p.var.name)
        if (node.component === "Add") {
            code.push(`SUM ${parentVars[0]} ${parentVars[1]} ${node.var.name}`)
        }
        if (node.component === "Subtract") {
            code.push(`SUB ${parentVars[0]} ${parentVars[1]} ${node.var.name}`)
        }
        if (node.component === "Multiply") {
            code.push(`MUL ${parentVars[0]} ${parentVars[1]} ${node.var.name}`)
        }
    }
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