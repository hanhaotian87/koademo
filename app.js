const Koa = require('koa')
const app = new Koa()
const views = require('koa-views')
const json = require('koa-json')
const onerror = require('koa-onerror')
const bodyparser = require('koa-bodyparser')
const Router = require('koa-router')
const logger = require('./core/common/logger').logger(__filename)
const path = require('path')
const cors = require('koa2-cors')

const index = require('./routes/index')
const users = require('./routes/usersformongo')
const usermysql = require('./routes/usersformysql')
const error = require('./routes/error')

// error handler
onerror(app)

// middlewares
app.use(bodyparser({
  enableTypes: ['json', 'form', 'text']
}))
app.use(json())
// app.use(accessLogger())
app.use(require('koa-static')(path.join(__dirname, '/public')))

app.use(views(path.join(__dirname, '/views'), {
  extension: 'pug'
}))

app.use(cors({ origin: function (ctx) { // 允许跨域请求，
  return '*' // 允许来自所有域名请求
},
maxAge: 3600 // method options 缓存 1小时，以免每次都是两个请求
}))

// logger
app.use(async (ctx, next) => {
  const start = new Date()
  // logger.info('path ' + ctx.matched[0].path + '  mathod : ' + ctx.mathod)
  await next()
  const ms = new Date() - start
  logger.info(`${ctx.method} ${ctx.url} - ${ms}ms`)
  logger.info(ctx.path + '  ' + ctx.href)
})

app.use(error)

// routes
let router = new Router({ prefix: '/prefix' })
router.use(index.routes(), index.allowedMethods())
router.use(users.routes(), users.allowedMethods())
router.use(usermysql.routes(), usermysql.allowedMethods())
app.use(router.routes(), router.allowedMethods())
// logger.info('index stack ' + JSON.stringify(router.stack))

// error-handling
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx)
})

module.exports = app
