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
const pguser = require('../core/models/pguser')
const fs = require('fs')
const zlib = require('zlib')
const StreamZip = require('node-stream-zip')
const globleConfig = require('../config/global_config')
const varManager = require('../core/manager/TestVarManager')

router.prefix('/indexpre')
router.get('*', async (ctx, next) => {
  logger.info('index * 1')
  await next()
  logger.info('index * 2')
})
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
  ctx.body = { code: ErrorCodes.OK, message: 'successful' }
}

router.get('/testZip', async (ctx, next) => {
  logger.info('testZip')
  let rootDir = path.dirname(__dirname)
  let src = path.join(rootDir, 'logs')
  let dst = path.join(rootDir, 'logs', 'logs.zip')
  let s = await zipUtil.zip(src, dst)
  logger.info('s ' + s)
  ctx.body = { code: ErrorCodes.OK, data: s, message: 'successful' }
})

router.get('/testUnZip', async (ctx, next) => {
  logger.info('testUnZip')
  let rootDir = path.dirname(__dirname)
  let src = path.join(rootDir, 'logs', 'logs.zip')
  let dst = path.join(rootDir, 'logs', 'log')
  let s = await zipUtil.unzip(src, dst)
  logger.info('s ' + s)

  ctx.body = { code: ErrorCodes.OK, data: s, message: 'successful' }
})

router.get('/testNodeStreamZipUnZip', async (ctx, next) => {
  let rootDir = path.dirname(__dirname)
  let zipPath = path.join(rootDir, 'logs', 'logs.zip')
  let newPath = path.join(rootDir, 'logs', 'log')
  const zip = new StreamZip({
    file: zipPath,
    storeEntries: true
  })

  zip.on('error', (err) => {
    logger.info(' err:' + err)
  })

  zip.on('ready', () => {
    if (!fs.existsSync(newPath)) {
      fs.mkdirSync(newPath)
    }
    zip.extract(null, newPath, (err, count) => {
      logger.info(err ? 'Extract error' : `Extracted ${count} entries`)
      zip.close()
      if (err) {
        logger.info(' err:' + err)
      } else {
        logger.info('extract finish ')
      }
    })
  })
  ctx.body = { retCode: 0 }
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
      ctx.body = { code: ErrorCodes.OK, data: result, message: 'successful' }
    } else {
      ctx.throw(400, { code: ErrorCodes.ERROR_LOGIN, message: '账号和密码不匹配' })
    }
  } catch (error) {
    ctx.throw(500, error)
  }
})

router.get('/clientGetTest', async (ctx, next) => {
  let clientGet = clientHttp.clientGet
  let result = await clientGet('/testGet', { a: 1 })
  ctx.body = { code: ErrorCodes.OK, data: result, message: 'successful' }
})

router.get('/lottery', async (ctx, next) => { // nodejs 后台做httpclient ,使用axios
  let result = await axios.get('/lottery/types', {
    params: {
      key: '135d5663d7eaeef8d07db06af92903ed'
    }
  })
  logger.info(JSON.stringify(result.data))
  ctx.body = { code: ErrorCodes.OK, data: result.data.result }
})

router.post('/lottery', async (ctx, next) => { // nodejs 后台做httpclient ,使用axios
  let result = await axios.post('/lottery/types', querystring.stringify({ key: '135d5663d7eaeef8d07db06af92903ed' }))
  logger.info(result.data.reason)
  ctx.body = { code: ErrorCodes.OK, data: result.data.result }
})
router.get('/postgresqlGet', async (ctx, next) => {
  try {
    var result = await pguser.list()
    logger.info(result.rows[0])
    ctx.body = { code: ErrorCodes.OK, data: result.rows, message: 'successful' }
  } catch (error) {
    ctx.throw(500, error)
  }
})

router.get('/postgresqlGetById', async (ctx, next) => {
  try {
    var result = await pguser.getById(1)
    logger.info(result.rows[0])
    ctx.body = { code: ErrorCodes.OK, data: result.rows, message: 'successful' }
  } catch (error) {
    ctx.throw(500, error)
  }
})

router.post('/postgresqlAdd', async (ctx, next) => {
  try {
    var result = await pguser.add({ name: 'xxx', age: 19 })
    logger.info(result)
    ctx.body = { code: ErrorCodes.OK, data: result.rows, message: 'successful' }
  } catch (error) {
    ctx.throw(500, error)
  }
})

router.patch('/postgresqlUpdate', async (ctx, next) => {
  try {
    var result = await pguser.change({ name: 'xxxa', age: 19, id: 2 })
    logger.info(result)
    ctx.body = { code: ErrorCodes.OK, data: result, message: 'successful' }
  } catch (error) {
    ctx.throw(500, error)
  }
})

router.get('/path', async (ctx, next) => {
  logger.info('url ' + ctx.url + '  href :' + ctx.href + '  ' + ctx.protocol)
  ctx.body = {
    title: 'koa2 path'
  }
})

router.get('/path/id', async (ctx, next) => {
  ctx.body = {
    title: 'koa2 path2 id'
  }
})

router.get('path:id', '/path/:id', async (ctx, next) => {
  let id = ctx.params.id
  logger.info('router path :' + ctx.routerName + '  ' + ctx.captures + ' params ' + JSON.stringify(ctx.params))
  ctx.body = {
    title: 'koa2 path1 ' + id
  }
})
var _mkdirsSync = function (dirname) {
  // logger.info('创建文件夹：'+dirname);
  if (fs.existsSync(dirname)) {
    return true
  } else {
    if (_mkdirsSync(path.dirname(dirname))) {
      fs.mkdirSync(dirname)
      return true
    }
  }
}
var copyFileSync = function (src, destPath, filename) {
  _mkdirsSync(destPath)
  let newPath = path.join(destPath, filename)
  fs.copyFileSync(src, newPath)
}
router.get('/fscopy', async (ctx, next) => {
  copyFileSync('./logs/logs1.zip', './logs/log', '1.zip')
  ctx.body = {
    title: 'fscopy'
  }
})

router.get('/testcpu', async (ctx, next) => {
  ctx.body = {
    title: 'testcpu'
  }
  setTimeout(function () {
    logger.info('1 min end')
  }, 60 * 1000)
})

router.get('/zlib', async (ctx, next) => {
  // copyFileSync('./logs/logs1.zip', './logs/log', '1.zip')
  let zipPath = path.join(globleConfig.getRootDir(), 'logs', 'logs.zip')
  logger.info('zipPath:' + zipPath)
  let zipBuffer = fs.readFileSync(zipPath)
  let result = zlib.unzipSync(zipBuffer)
  logger.info('result :' + JSON.stringify(result))
  ctx.body = {
    title: result
  }
})

router.get('/testVar', async (ctx, next) => {
  varManager.a = 5
  let c = varManager.b
  c()
  ctx.body = { a: 'aa' }
})

router.get('/testUpdateUser', async (ctx, next) => {
  userManager.updateUser('5c77a2679907b953f833d9f2', { 'location.text': '123456' })
  ctx.body = { a: 'aa' }
})

module.exports = router
