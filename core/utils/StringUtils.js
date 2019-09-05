var crypto = require('crypto')

module.exports.md5 = function (text) {
  return crypto.createHash('md5').update(text).digest('hex')
}
module.exports.getReqRemoteIp = function (req) {
  return (req.headers['x-forwarded-for'] || '').split(',')[0] || req.ip
}

module.exports.trim = function (s) {
  return s.replace(/(^\s*)|(\s*$)/g, '')
}
