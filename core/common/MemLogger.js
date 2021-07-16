'use strict'
const log4js = require('koa-log4')
const path = require('path')
const appBase = path.join(__dirname)

class MemLogger {
  constructor (category) {
    this.category = category
    this.appBase = appBase
    this.memFlag = true
  }

  setAppBase (src) {
    this.appBase = src || appBase
  }

  setMemVisible (flag) {
    this.memFlag = flag
  }

  getLog4js () {
    return log4js
  }

  getLogger () {
    let c = this.category
    if (c && c.substr(0, this.appBase.length) === this.appBase) {
      c = path.relative(this.appBase, c)
      this.memFlag ? c =
        '[' +
        process.pid +
        ']' + '[mem:' +
        parseInt(process.memoryUsage().rss / 1024) +
        ']' +
        c : c =
        '[' +
        process.pid +
        ']' + c
    }
    return log4js.getLogger(c)
  }

  trace (message, ...args) {
    this.getLogger().trace(message, ...args)
  }
  debug (message, ...args) {
    this.getLogger().debug(message, ...args)
  }
  info (message, ...args) {
    this.getLogger().info(message, ...args)
  }
  warn (message, ...args) {
    this.getLogger().warn(message, ...args)
  }
  error (message, ...args) {
    this.getLogger().error(message, ...args)
  }
  fatal (message, ...args) {
    this.getLogger().fatal(message, ...args)
  }
}

module.exports = MemLogger
