'use strict'
const path = require('path')
const log4js = require('koa-log4')
const commonUtil = require('../utils/commonUtil')
const appBase = path.join(__dirname, '../..')

const CONFIG_RELOAD_SECS = 300
const LOG4JS_DEV_CONF = 'log4js-dev.json'
const LOG4JS_PRD_CONF = 'log4js.json'

// log4js 配置段
function setupLog4js() {
  console.log('setupLog4js : ' + process.env.NODE_ENV)
  const fileName =
    process.env.NODE_ENV === 'production' ? LOG4JS_PRD_CONF : LOG4JS_DEV_CONF
  log4js.configure(commonUtil.getConfigPath() + '/' + fileName, {
    cwd: appBase,
    reloadSecs: CONFIG_RELOAD_SECS,
  })
}

setupLog4js()

exports.accessLogger = () => log4js.koaLogger(log4js.getLogger('access')) // 记录所有访问级别的日志
exports.logger = function (category) {
  let c = category
  if (c && c.substr(0, appBase.length) === appBase) {
    c = path.relative(appBase, c)
    c = '[' + process.pid + ']' + c
  }
  return log4js.getLogger(c)
} // 记录所有应用级别的日志
