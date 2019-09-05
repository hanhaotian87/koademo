const zipUtil = require('@hanhaotian/zip-util')
const logger = require('../common/logger').logger(__filename)

async function unzip (src, dest) {
  let result = await zipUtil.unzip(src, dest)
  logger.log('unzip result : ' + result)
  return result
}

async function zip (src, dest, newName) {
  let result = await zipUtil.zip(src, dest, newName)
  logger.log('zip result : ' + result)
  return result
}

module.exports.unzip = unzip
module.exports.zip = zip
