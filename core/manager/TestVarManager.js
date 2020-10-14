var logger = require('../common/logger').logger(__filename)

var a = 3

function b () {
  logger.debug(a)
}

module.exports = {
  a: a,
  b: b
}
