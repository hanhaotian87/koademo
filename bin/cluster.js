#!/usr/bin/env node
'use strict'

const http = require('http')
const cluster = require('cluster')
const os = require('os')
const app = require('../app')
// logger = require('../core/common/logger'),
const port = normalizePort(process.env.PORT || '3000')
const numCPUs = os.cpus().length
const logger = require('../core/common/logger')(__filename)
app.set('port', port)

if (cluster.isMaster) {
  logger.info('创建 ' + numCPUs + ' 个子进程')
  for (var i = 0; i < numCPUs; i++) {
    cluster.fork()
  }

  cluster.on('listening', function (worker, address) {
    logger.info('Listening: Worker ' + worker.process.pid + ', Address: ' + address.address + ':' + address.port)
  })

  cluster.on('exit', function (worker, code, signal) {
    logger.info('Exit: worker', worker.process.pid)
  })

  process.on('SIGINT', function () {
    logger.info('Caught SIGINT, terminate...')
    try {
      cluster.disconnect(function (err) {
        if (err) {
          logger.info('Master disconnect faile:', err)
        } else {
          logger.info('Master exited')
        }
        process.exit()
      })
    } catch (e) {
      logger.error('Master disconnect exception:', e)
      process.exit()
    }
  }).on('uncaughtException', function (err) {
    logger.error('uncaughtException:', err)
  })
} else if (cluster.isWorker) {
  /**
     * Create HTTP server.
     */

  var server = http.createServer(app)
  server.listen(port)
  server.on('error', onError)
  server.on('listening', onListening)

  cluster.on('disconnect', function () {
    logger.info('Worker cluster disconnect')
    server.close(function (err) {
      logger.info('http server closed.')
      process.exit()
    })
  })

  process.on('uncaughtException', function (err) {
    logger.error('uncaughtException:', err)
  })
}

/**
 * Normalize a port into a number, string, or false.
 */
function normalizePort (val) {
  var port = parseInt(val, 10)
  if (isNaN(port)) { return val }
  if (port >= 0) { return port }
  return false
}

function onError (error) {
  if (error.syscall !== 'listen') {
    throw error
  }

  var bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port

  switch (error.code) {
    case 'EACCES':
      logger.error(bind + ' requires elevated privileges')
      process.exit(1)
      break
    case 'EADDRINUSE':
      cologgernsole.error(bind + ' is already in use')
      process.exit(1)
      break
    default:
      throw error
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening () {
  var addr = server.address()
  var bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr.port
  logger.info('Listening on ' + bind)
}
