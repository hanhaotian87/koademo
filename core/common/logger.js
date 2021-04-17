'use strict'
const path = require('path')
const commonUtil = require('../utils/commonUtil')
const appBase = path.join(__dirname, '../..')
const MemLogger = require('./MemLogger')

const CONFIG_RELOAD_SECS = 300
const LOG4JS_DEV_CONF = 'log4js-dev.json'
const LOG4JS_PRD_CONF = 'log4js.json'

// log4js 配置段
function setupLog4js (log4js) {
  console.log('setupLog4js : ' + process.env.NODE_ENV)
  const fileName =
    process.env.NODE_ENV === 'production' ? LOG4JS_PRD_CONF : LOG4JS_DEV_CONF
  log4js.configure(commonUtil.getConfigPath() + '/' + fileName, {
    cwd: appBase,
    reloadSecs: CONFIG_RELOAD_SECS
  })
}

exports.logger = function (category) {
  let mLogger = new MemLogger(category)
  setupLog4js(mLogger.getLog4js())
  mLogger.setAppBase(appBase)
  return mLogger
} // 记录所有应用级别的日志
