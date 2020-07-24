/**
 * Created by Michael Han on 18-9-26.
 */
var path = require('path')
// const logger = require('../core/common/logger')(__filename)

var getRootDir = function () {
//   logger.info(' getCutDir process.env.NODE_ENV is production ' + (process.env.NODE_ENV === 'production'))
  let projectDir = path.dirname(__dirname)
  return projectDir
}
module.exports = {
  getRootDir: getRootDir
}
