// var UserDao = require('../core/dao/UserDao')
var cipher = require('../core/common/cipher')
const consts = require('../core/common/Consts')
const logger = require('../core/common/logger').logger(__filename)
var commonUtil = require('../core/utils/commonUtil')

const verify = async function (ctx, next) {
  logger.info('verify', ctx.host + ' ' + '  ' + ctx.originalUrl + '  ' + ctx.path)

  // logger.info("originalUrl : "+req.originalUrl);
  const sjtoken = ctx.get(consts.DEVICE_TOKEN)
  const telno = ctx.get(consts.USER_TELNO)
  logger.info('sjtoken: ' + JSON.stringify(sjtoken))
  if (!sjtoken) {
    // throw statusError(401, `Access denied: 当前用户未登录!`);
    // ctx.status = 401
    // ctx.message = 'Access denied: 当前用户未登录!'
    return ctx.throw(401, { retCode: 401, message: 'Access denied: 当前用户未登录!' })
    // return false
  }

  // var user = await UserDao.findOne({ 'auths.token': sjtoken }).exec()
  commonUtil.decodeToken(sjtoken)
  logger.info('sjtoken :' + JSON.stringify(sjtoken))
  if (!commonUtil.checkTokenValid(sjtoken, telno)) { // 查看会话是否过期
    // ctx.status = 401
    // ctx.message = 'Access denied,may be login timeout!'
    return ctx.throw(401, { retCode: 401, message: 'Access denied,may be login timeout!' })
    // return false
    // return res.json({retCode: 0, message: "Access denied,may be login timeout!"});
  }

  let method = ctx.method
  let queryStr = ''
  if (method.toUpperCase() === consts.GET || method.toUpperCase() === consts.DELETE) {
    let querys = ctx.query
    logger.info('querys : ' + JSON.stringify(querys))
    let keys = Object.keys(querys).sort()
    for (const key of keys) {
      let value = querys[key]
      queryStr = queryStr + key + value
    }
  } else if (method.toUpperCase() === consts.POST || method.toUpperCase() === consts.PATCH) {
    let bodys = ctx.request.body
    let bKeys = Object.keys(bodys).sort()
    for (const key of bKeys) {
      let value = bodys[key]
      queryStr = queryStr + key + value
    }
  }

  const path = (ctx.path.replace('/emms', '') || '')
  logger.info('path : ' + path + ' queryStr ' + queryStr)
  const timestamp = (ctx.get('Timestamp') || '')
  const signature = (ctx.get('Signature') || '')
  const signStr = path + timestamp + (queryStr || '')
  const digest = cipher.md5(signStr)
  // logger.debug(path + ' ' + timestamp + ' ' + user.password)
  logger.info('digest : ' + digest + '  signature : ' + signature)
  if (digest.toLowerCase() !== signature.toLowerCase()) {
    logger.debug('md5("%s")=expected: "%s", received: "%s"', signStr, digest, signature)
    // ctx.status = 406
    // ctx.message = 'Access denied: Bad signature'
    return ctx.throw(406, { retCode: 406, message: 'Access denied: Bad signature' })
    // return false
  }

  return next()
}

var signVerification = async function (ctx, next) {
  await verify(ctx, next)
}

module.exports = signVerification
