const Koa = require('koa')
const app = new Koa()
const views = require('koa-views')
const json = require('koa-json')
const onerror = require('koa-onerror')
const bodyparser = require('koa-bodyparser')
const logger = require('./core/common/logger').logger(__filename)
const path = require('path')

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

// logger
app.use(async (ctx, next) => {
  const start = new Date()
  await next()
  const ms = new Date() - start
  logger.info(`${ctx.method} ${ctx.url} - ${ms}ms`)
})

app.use(error)

// routes
app.use(index.routes(), index.allowedMethods())
app.use(users.routes(), users.allowedMethods())
app.use(usermysql.routes(), usermysql.allowedMethods())

// error-handling
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx)
})

module.exports = app
