/* eslint-disable camelcase */
var db_pool = require('../../config/mysqldb_pool')
const logger = require('../common/logger').logger(__filename)
var count = 0

var User = {

  list: async function () {
    count++
    logger.info('sql list start ' + count)
    let dbPool = await db_pool()
    let result = ''
    try {
      result = await dbPool.query('SELECT * FROM user')
    } catch (error) {
      logger.error('list :' + error)
    }
    logger.info('sql list end ' + count)
    return result
  },
  change: async function (text) {
    // db_pool.query('UPDATE users SET name = :name WHERE id = :id',
    //     {id: id, name: text.name});
    let dbPool = await db_pool()
    let result = await dbPool.query('UPDATE user SET name = ?, age = ?, sex = ? WHERE id = ?',
      [text.name, text.age, text.sex, text.id])
    return result
  },

  getById: async function (id) {
    let dbPool = await db_pool()
    let result = await dbPool.query('SELECT * FROM user WHERE id = ?', [id])
    return result
  },

  delete: async function (id) {
    let dbPool = await db_pool()
    let result = await dbPool.query('DELETE FROM user WHERE id = ?', [id])
    return result
  },
  add: async function (user) {
    let dbPool = await db_pool()
    let result = await dbPool.query('INSERT INTO user SET ?', {
      name: user.name,
      age: user.age,
      sex: user.sex
    })
    return result
  }
}

module.exports = User
