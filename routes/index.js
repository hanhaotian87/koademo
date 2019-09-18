const router = require('koa-router')()
const logger = require('../core/common/logger').logger(__filename)
const verify = require('./signverification')
const ErrorCodes = require('../core/common/ErrorCodes')
const commonUtil = require('../core/common/commonUtil')
const userManager = require('../core/manager/UserManager')
const zipUtil = require('../core/utils/zipUtil')
const path = require('path')
let MobileDetect = require('mobile-detect')
const clientHttp = require('../modules/clienthttp')
const axios = require('../modules/axiosClientA')
const querystring = require('querystring')

router.get('/json', async (ctx, next) => {
  ctx.body = {
    title: 'koa2 json'
  }
})

router.post('/testpost', /* verify, */ testPost)

async function testPost (ctx, next) {
  let postBody = ctx.request.body
  let query = ctx.query
  logger.info(JSON.stringify(postBody) + ' ' + JSON.stringify(query))
  ctx.body = { retCode: ErrorCodes.OK }
}

router.get('/testZip', async (ctx, next) => {
  logger.info('testZip')
  let rootDir = path.dirname(__dirname)
  let src = path.join(rootDir, 'logs')
  let dst = path.join(rootDir, 'logs', 'logs.zip')
  let s = await zipUtil.zip(src, dst)
  logger.info('s ' + s)
  ctx.body = { retCode: ErrorCodes.OK, info: s }
})

router.get('/testUnZip', async (ctx, next) => {
  logger.info('testUnZip')
  let rootDir = path.dirname(__dirname)
  let src = path.join(rootDir, 'logs', 'logs.zip')
  let dst = path.join(rootDir, 'logs', 'log')
  let s = await zipUtil.unzip(src, dst)
  logger.info('s ' + s)
  ctx.body = { retCode: ErrorCodes.OK, info: s }
})

router.post('/login', async (ctx, next) => {
  logger.info('login : req body ' + JSON.stringify(ctx.request.body))
  let username = ctx.request.body.username
  let password = ctx.request.body.password
  let md = new MobileDetect(ctx.headers['user-agent'])
  let deviceType = commonUtil.getDeviceType(md)
  logger.info('md ' + JSON.stringify(md) + ' deviceType ' + deviceType + ' username ' + username)
  try {
    let result = await userManager.login(username, password, deviceType)
    logger.info('login result :' + JSON.stringify(result))
    if (result) {
      ctx.body = { retCode: ErrorCodes.OK, result: result }
    } else {
      ctx.throw(400, { retCode: ErrorCodes.ERROR_LOGIN, message: '账号和密码不匹配' })
    }
  } catch (error) {
    ctx.throw(500, error)
  }
})

router.get('/clientGetTest', async (ctx, next) => {
  let clientGet = clientHttp.clientGet
  let result = await clientGet('/testGet', { a: 1 })
  ctx.body = { retCode: ErrorCodes.OK, data: result }
})

router.get('/lottery', async (ctx, next) => { // nodejs 后台做httpclient ,使用axios
  let result = await axios.get('/lottery/types', {
    params: {
      key: '135d5663d7eaeef8d07db06af92903ed'
    }
  })
  logger.info(JSON.stringify(result.data))
  ctx.body = { retCode: ErrorCodes.OK, data: result.data.result }
})

router.post('/lottery', async (ctx, next) => { // nodejs 后台做httpclient ,使用axios
  let result = await axios.post('/lottery/types', querystring.stringify({ key: '135d5663d7eaeef8d07db06af92903ed' }))
  logger.info(result.data.reason)
  ctx.body = { retCode: ErrorCodes.OK, data: result.data.result }
})
module.exports = router
