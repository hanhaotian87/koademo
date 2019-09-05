/* eslint-disable camelcase */
var mysql = require('promise-mysql')
var config = require('./db_config')

async function dbPool () {
  var db_pool = await mysql.createPool(config)
  return db_pool
}

module.exports = dbPool
