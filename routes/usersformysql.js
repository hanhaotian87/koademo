/* eslint-disable handle-callback-err */
const router = require('koa-router')()
const logger = require('../core/common/logger').logger(__filename)
const ErrorCodes = require('../core/common/ErrorCodes')
const mUser = require('../core/models/user')
const verify = require('./signverification')

router.prefix('/usersmysql')

/**
 * mysql 使用
 */
router.get('/list', /* verify, */ async function (ctx, next) {
  try {
    logger.info('list start')
    let result = await mUser.list()
    logger.info('result :' + JSON.stringify(result))
    ctx.body = { retCode: ErrorCodes.OK, result: result }
  } catch (error) {
    ctx.throw(500, error)
  }
})

router.patch('/change', /* verify, */ async function (ctx, next) {
  let text = ctx.request.body
  try {
    let result = await mUser.change(text)
    ctx.body = { retCode: ErrorCodes.OK, result: result }
  } catch (error) {
    ctx.throw(500, error)
  }
})

router.post('/add', /* verify, */async function (ctx, next) {
  let text = ctx.request.body
  try {
    let result = await mUser.add(text)
    ctx.body = { retCode: ErrorCodes.OK, result: result }
  } catch (error) {
    ctx.throw(500, error)
  }
})
module.exports = router
