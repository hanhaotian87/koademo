/* eslint-disable camelcase */
var mysql = require('promise-mysql')
var config = require('./mysqldb_config')
var { mysqlPool } = require('../core/common/static')

// 避免重复创建连接池
async function dbPool () {
  var db_pool
  if (!mysqlPool.pool) {
    db_pool = await mysql.createPool(config)
  } else {
    db_pool = mysqlPool.pool
  }
  return db_pool
}

module.exports = dbPool
