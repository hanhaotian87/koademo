'use strict'

/**
 * MongoDB客户端，基于mongoose。
 */
const mongoose = require('mongoose')
const logger = require('../common/logger').logger(__filename)

let isProduction = (process.env.NODE_ENV === 'production')
let mongoDbUrl = 'mongodb://localhost:27017/koademo'
var mongodb = {
  dbUrl: mongoDbUrl,
  poolSize: 10, // 连接池大小
  concurrency: 5 // 并发访问mongodb时，控制最大的并发数（用于控制Promise.map()等操作）
}

/** 数据库连接URL */
const dbUrl = mongodb.dbUrl

logger.info('process title : ' + process.title)
let reg = new RegExp(/cluster.js$/)
var poolSize = reg.test(process.title) ? mongodb.poolSize : 2
logger.info('poolSize : ' + poolSize)

/** 数据库连接配置 */
const options = {
  useNewUrlParser: true,
  poolSize: poolSize,
  reconnectTries: Number.MAX_VALUE,
  reconnectInterval: 1000,
  autoReconnect: true,
  keepAlive: 1
  // promiseLibrary: bluebird // MongoDB Driver Promise
}

// mongoose.Promise = bluebird;
mongoose.connect(dbUrl, options)
mongoose.connection
  .on('error', function (err) {
    logger.error('connection error:', err.message)
  })
  .on('open', function () {
    logger.info('connected')
  })

function collection (modelName, schemaInfo) {
  const schema = mongoose.Schema(schemaInfo)
  return {
    mongoose: mongoose,
    modelName: modelName,
    schema: schema,
    model: mongoose.model(modelName, schema, modelName)// mongodb 3.6.0
  }
}

module.exports = {
  mongoose: mongoose,
  collection: collection,
  ObjectId: mongoose.Schema.ObjectId
}
