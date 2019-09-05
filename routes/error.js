const logger = require('../core/common/logger').logger(__filename)

module.exports = async (ctx, next) => {
  try {
    await next()
    // logger.error('status' + ctx.status + ' err ' + ctx.message)
    if (ctx.status >= 400 && ctx.status < 600) { // 请求接口没有时被调用
      ctx.throw(ctx.status, { retCode: 404, message: ctx.message })
    }
  } catch (err) {
    logger.error('route error ' + err)
    const status = err.status || 500
    ctx.status = status
    ctx.body = { retCode: err.retCode, message: err.message }
    if (status === 404) {
      ctx.body = { retCode: err.retCode, message: err.message }
    } else if (status === 500) {
      ctx.body = { message: '服务器错误' }
    }
  }
}
