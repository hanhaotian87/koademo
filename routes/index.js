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
const base = require('../core/utils/base')
const ossUtil = require('../core/utils/ossUtil')
const mfsign = require('../core/common/mfSign')

const httpService = require('../core/utils/http_service')
const { gets, sets, expire } = require('../core/utils/rediscli')

router.prefix('/indexpre')
router.get('*', async (ctx, next) => {
  logger.info('index * 1')
  await next()
  logger.info('index * 2')
})
router.get('/json', async (ctx, next) => {
  logger.debug('test json 0')
  // mLogger.info('test json 1')
  let a = { kk: 12345, bb: 'test' }
  ctx.body = {
    title: 'koa2 json',
  }
  logger.info('test:' + JSON.stringify(a))
  // mLogger.info('test json 2')
})

router.get('/mfsign', async (ctx, next) => {
  logger.debug('test mfsign 0')
  mfsign()
  ctx.body = {
    title: 'mfsign json',
  }
  logger.info('test:' + JSON.stringify(a))
  // mLogger.info('test json 2')
})

router.post('/testpost', /* verify, */ testPost)

async function testPost(ctx, next) {
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
    storeEntries: true,
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
  logger.info(
    'md ' +
      JSON.stringify(md) +
      ' deviceType ' +
      deviceType +
      ' username ' +
      username
  )
  try {
    let result = await userManager.login(username, password, deviceType)
    logger.info('login result :' + JSON.stringify(result))
    if (result) {
      ctx.body = { code: ErrorCodes.OK, data: result, message: 'successful' }
    } else {
      ctx.throw(400, {
        code: ErrorCodes.ERROR_LOGIN,
        message: '账号和密码不匹配',
      })
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

router.get('/lottery', async (ctx, next) => {
  // nodejs 后台做httpclient ,使用axios
  let result = await axios.get('/lottery/types', {
    params: {
      key: '135d5663d7eaeef8d07db06af92903ed',
    },
  })
  logger.info(JSON.stringify(result.data))
  ctx.body = { code: ErrorCodes.OK, data: result.data.result }
})

router.post('/lottery', async (ctx, next) => {
  // nodejs 后台做httpclient ,使用axios
  let result = await axios.post(
    '/lottery/types',
    querystring.stringify({ key: '135d5663d7eaeef8d07db06af92903ed' })
  )
  logger.info(result.data.reason)
  ctx.body = { code: ErrorCodes.OK, data: result.data.result }
})

router.get('/20tn', async (ctx, next) => {
  // nodejs 后台做httpclient ,使用axios
  try {
    /* let result = await ossUtil.download(
      'http://ota.3jyun.com/upgradePackageDev/JT-BF-20TN/00.02.03/JT-BF-20TNV0.2.3.bin'.replace(
        /^http:\/\/[^/]+/,
        ''
      ),
      0,
      15
    ) */
    let result = await axios.get(
      '/upgradePackageDev/JT-BF-20TN/00.02.03/JT-BF-20TNV0.2.3.bin'
    )
    let data = result
    let hexData = Buffer.from(data).toString('hex')
    logger.info(JSON.stringify(data) + '  hexData:' + hexData)
    ctx.body = { code: ErrorCodes.OK, data: hexData }
  } catch (error) {
    logger.error(error)
  }
  /* let binFilePath = path.join(
    commonUtil.getRootPath(),
    'testData/JT-BF-20TNV0.2.3.bin'
  )
  logger.debug('binFilePath :' + binFilePath)
  let result1 = await base.readFile(binFilePath)
  let data1 = result1.data
  let hexData = data1.slice(0, 15).toString('hex') */
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
    title: 'koa2 path',
  }
})

router.get('/path/id', async (ctx, next) => {
  ctx.body = {
    title: 'koa2 path2 id',
  }
})

router.get('path:id', '/path/:id', async (ctx, next) => {
  let id = ctx.params.id
  logger.info(
    'router path :' +
      ctx.routerName +
      '  ' +
      ctx.captures +
      ' params ' +
      JSON.stringify(ctx.params)
  )
  ctx.body = {
    title: 'koa2 path1 ' + id,
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
    title: 'fscopy',
  }
})

router.get('/testcpu', async (ctx, next) => {
  ctx.body = {
    title: 'testcpu',
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
    title: result,
  }
})

router.get('/testVar', async (ctx, next) => {
  varManager.a = 5
  let c = varManager.b
  c()
  ctx.body = { a: 'aa' }
})

router.get('/testUpdateUser', async (ctx, next) => {
  userManager.updateUser('5c77a2679907b953f833d9f2', {
    'location.text': '123456',
  })
  ctx.body = { a: 'aa' }
})

router.get('/testNanjing', async (ctx, next) => {
  let token = await nanjingGetToken()
  logger.debug('token :' + token)
  ctx.body = { a: 'aa' }
})

const md5 = require('md5-node')
const tokenTag = 'NANJINGZHIDUI_TOKEN'
const unitId = '1469770'
const requestSecret = '8c8f9efb2bb44fc78d28e56527dc13b4'
const systemCode = 'e16f14de-b63e-40d1-9f37-e41298c6126e'

const nanjingGetToken = async (isFresh = false) => {
  const requestTime = new Date().getTime()
  const tokenKey = [tokenTag, unitId, systemCode].join('_')
  let token = await gets(tokenKey)
  logger.info('token :' + token)
  if (token && !isFresh) {
    return token
  }
  const sign = md5(unitId + requestSecret + systemCode + requestTime)
  const res = await httpService.msgPost(
    'http://iot.xgt2014.com:8090/common/getPushDataRequestSecret?unitId=1469770&requestTime=' +
      requestTime +
      '&sign=' +
      sign
  )
  logger.info('res :' + JSON.stringify(res.data))

  try {
    let statusCode = res.data.status
    if (statusCode < 200 || statusCode >= 300) {
      throw new Error('statusCode=' + statusCode)
    }
    token = res.data.data.requestSecret
    sets(tokenKey, token)
    expire(tokenKey, 10800)
    logger.info('[nanjingzhidui] token:', token)
  } catch (e) {
    logger.error('[nanjingzhidui] token get error:', e)
  } finally {
    // eslint-disable-next-line no-unsafe-finally
    return token
  }
}

module.exports = router
