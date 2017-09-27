var debug           = require('debug')('odin-api:controllers:session')
var session         = require('../helpers/session')

/**
 * Pipeline function to execute the project
 * @todo: Rewrite all of this to work properly
 */
module.exports.execute = (args) => {
    return new Promise((resolve, reject) => { 
        debug("Calling execute() controller")
        args.data.response = "Executed"
        resolve(args)
    })
}

// let currentVar = 'A'

// debug('Adding controller: login')
// module.exports.execute = function(req, res, next) {
//     let inputs = []

//     debug("Executing session")
//     debug(req.body)
//     nodes = req.body
//     lastNode = null
//     nodes.forEach(node => {
//         if (node.component === 'Output') {
//             if (lastNode == null) {
//                 lastNode = node
//             } else {
//                 return next("Multiple output components not allowed!")
//             }
//         }
//         node.var = currentVar
//         currentVar = nextChar(currentVar)
//         debug("Assigning variable " + node.var + " to " + node.id)
//         if (node.component === 'Input') {
//             inputs.push(node)
//             node.lookedAt = true
//         }
//         node.edges.forEach(edge => {
//             findNeighbour(nodes, node, edge)
//         })
//     })
//     if (lastNode == null) {
//         return next("No output node!")
//     }
//     debug("There is only one output node, and it is " + lastNode.id)
//     if (inputs.length === 0) {
//         next("There needs to be at least one input!")
//     }
//     debug("There is at least one input")
//     debug(inputs)
//     debug(nodes)

//     // inputs.forEach(input => {
//     //     crawlTree(input, nodes)
//     // })
//     crawlTree(lastNode, nodes)
//     debug("")
//     debug("")
//     debug("")
    
//     nodes.forEach(node => {
//         if (["Add", "Subtract", "Multiply", "Divide"].includes(node.component)) {
//             node.instruction = node.component.toUpperCase() + " " + node.var + node.varsUsed.join(' ')
//         }
//     })
    
//     debug(nodes)
//     // session.start()
//     res.status(200).send("Success")
// }

// function nextChar(c) {
//     return String.fromCharCode(c.charCodeAt(0) + 1)
// }

// function findNeighbour(nodes, currentNode, edgeID) {
//     nodes.forEach(node => {
//         if (node != currentNode && node.edges.includes(edgeID)) {
//             if (!currentNode.hasOwnProperty('neighbours')) {
//                 currentNode.neighbours = []
//             }
//             if (!currentNode.neighbours.includes(node.id)) {
//                 currentNode.neighbours.push(node.id)
//             }
//         }
//     })
// }

// function getNode(nodes, nodeID) {
//     debug("Looking for " + nodeID)
//     theNode = null
//     nodes.forEach(node => {
//         if (node.id == nodeID) {
//             theNode = node
//         }
//     })
//     return theNode
// }

// function crawlTree(node, nodes) {
//     debug("Crawling from " + node.id)

//     node.neighbours.forEach(neighbour => {
//         neighbour = getNode(nodes, neighbour)
//         debug(getNode(nodes, neighbour))
//         if (neighbour.component == "Output") {
//             debug("Arrived at output")
//             neighbour.lookedAt = true
//             return
//         }
//         debug("Looking at neighour " + neighbour.id)
//         if (["Add", "Subtract", "Multiply", "Divide"].includes(neighbour.component) && !neighbour.lookedAt) {
//             if (!neighbour.hasOwnProperty("varsUsed")) {
//                 neighbour.varsUsed = []
//             }
//             neighbour.varsUsed.push(node.var)
//             neighbour.lookedAt = true
//             crawlTree(neighbour, nodes)
//         }
//     })
// }