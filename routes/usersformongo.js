/* eslint-disable handle-callback-err */
const router = require('koa-router')()
const userManager = require('../core/manager/UserManager')
const logger = require('../core/common/logger').logger(__filename)
const ErrorCodes = require('../core/common/ErrorCodes')
const verify = require('./signverification')
const base = require('../core/utils/base')
const fs = require('fs')
const path = require('path')

router.prefix('/users')

/* router.get('*', async (ctx, next) => {
  await next()
}) */

router.post('/', /* verify, */ addUser)
router.get('/:id', /* verify, */ getUser)
router.patch('/:id', /* verify, */ updateUser)
router.delete('/:id', /* verify, */ deleteUser)

/**
 * @api {post} /users 添加用户
 * @apiName addUser
 * @apiGroup users
 *
 *
 * @apiParam {String}  username 用户名
 * @apiParam {String}  password 密码
 * @apiParam {Number}  status 账号状态
 * @apiParamExample {json} Request:
 *     {
 *       "username": "13112340001"，
 *       "password":"pwdaaaaaa",
 *       "status":1,
 *     }
 * @apiSuccess {Number} code
 * @apiSuccess {String} message
 * @apiSuccess {ObjectId} _id 用户ID
 * @apiSuccessExample Success-Response:
 * HTTP/1.1 200 OK
 * {
 * "code":0,
 * "_id":"5caabc0847d72c1e0c6d4e64"
 * }
 *
 * @apiSuccessExample Error-Response:
 * HTTP/1.1 400 用户已存在
 *     {
 *       "code":106,
 *       "message":"用户已存在"
 *     }
 *
 * @apiSuccessExample Error-Response:
 *     HTTP/1.1 400 电话号码非法
 *     {
 *       "code":110,
 *       "message":"电话号码非法"
 *     }
 */
async function addUser (ctx, next) {
  /* let newUser = {
    username: 'test',
    password: '123458',
    status: 1
  } */
  let username = ctx.request.body.username
  let password = ctx.request.body.password
  let newUser = {
    username: username,
    password: password
  }
  try {
    let result = await userManager.addUser(newUser)
    logger.info('result : ' + JSON.stringify(result))
    ctx.body = { code: ErrorCodes.OK, data: result, message: 'successful' }
  } catch (error) {
    ctx.throw(500, error)
  }
}

async function getUser (ctx, next) {
  let id = ctx.params.id
  try {
    logger.info('getUser start ' + new Date().getMilliseconds())
    let result = await userManager.getUser(id)
    logger.info('getUser end ' + new Date().getMilliseconds())
    logger.info('result : ' + JSON.stringify(result))

    testBuffer()
    ctx.body = { code: ErrorCodes.OK, data: result, message: 'successful' }
  } catch (error) {
    ctx.throw(500, error)
  }
}

async function updateUser (ctx, next) {
  let id = ctx.params.id
  let updateSet = ctx.request.body
  try {
    let result = await userManager.updateUser(id, updateSet)
    logger.info('result : ' + JSON.stringify(result))
    ctx.body = { code: ErrorCodes.OK, data: result, message: 'successful' }
  } catch (error) {
    ctx.throw(500, error)
  }
}

async function deleteUser (ctx, next) {
  let id = ctx.params.id
  try {
    let result = await userManager.deleteUser(id)
    logger.info('result : ' + JSON.stringify(result))
    ctx.body = { code: ErrorCodes.OK, data: result, message: 'successful' }
  } catch (error) {
    ctx.throw(500, error)
  }
}

function testBuffer () {
  let handPath = path.join(__dirname, 'M001HAND.BIN')
  fs.readFile(handPath, function (err, data) {
    logger.info('err ' + err)
    if (!err) {
      let buf = data
      let len = buf.length

      logger.info('len : ' + len)
      let headerdata = buf.slice(0, 32)
      logger.info('header : ' + headerdata.toString())
      let hands = []
      let dataBuf = buf.slice(32)
      let size = dataBuf.length / 4
      logger.info('readHANDBin size = ' + dataBuf.length + '  ' + base.buffToBoolean(dataBuf[0]))
      let a = []
      for (let i = 0; i < 2; i++) {
        a[i] = dataBuf[i + 4]
      }
      logger.info('a ' + base.byteArrayToInt(a) + '  ' + base.byteToInt(a[0]))
    }
  })
}

module.exports = router
