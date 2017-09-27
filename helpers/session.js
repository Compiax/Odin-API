var debug     = require('debug')('odin-api:helpers:session')
var config    = require('config')
var net       = require('net')

var session = {}

session.start = function() {
  var variables  = [
    "{ name: 'a', dimensions: [2 2], value: [1, 1, 1, 1]}",
    "{ name: 'b', dimensions: [2 2], value: [1, 1, 1, 1]",
    "{ name: 'c', dimensions: [2 2] }",
    "{ name: 'result', dimensions: [2 2] }"
  ]
  var operations = [
    "ADD a, b, c",
    "SUM b, c, d",
    "DOT a, a, result"
  ]

  var client = new net.Socket()
  var host = config.servers.daemon.host
  var port = config.servers.daemon.port

  debug(`Attempting to connect to ${host}:${port}`)
  client.connect(port, host, function() {
      debug(`Connected to daemon on ${host}:${port}`)
      debug("Sending variables:")
      variables.forEach((item) => {
          client.write(item) + "\n"
          debug(item)
      })
      debug("Sending operations:")
      operations.forEach((item) => {
          client.write(item) + "\n"
          debug(item)
      })
      debug("Session sent. Awaiting result")
  })

  client.on('data', function(data) {
      debug('Received result:')
      debug(String(data))
      // client.destroy() // kill client after server's response
  })

  client.on('close', function() {
      debug('Connection closed')
  })
}

module.exports = session
