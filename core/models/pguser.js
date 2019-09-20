/* eslint-disable camelcase */
var db_pool = require('../../config/postgresdb_pool')
const logger = require('../common/logger').logger(__filename)
const ErrorCodes = require('../common/ErrorCodes')
var count = 0

var User = {

  list: async function () {
    let pool = db_pool.pool
    let result = ''
    try {
      result = await pool.query('SELECT * FROM public.user') // public 这里是 schemas
    } catch (error) {
      logger.error('list :' + error)
    }
    logger.info('sql list end ' + count)
    return result
  },
  change: async function (text) { // 事务使用
    let client = await db_pool.client()
    logger.info(JSON.stringify(client))
    try {
      await client.query('BEGIN')
      await client.query('UPDATE public.user SET name =$1, age = $2 WHERE id = $3',
        [text.name, text.age, text.id])
      await client.query('INSERT INTO public.user values ($1,$2)', [ text.name,
        text.age + 1
      ])
      await client.query('COMMIT')
      return ErrorCodes.OK
    } catch (error) {
      await client.query('ROLLBACK')
      return ErrorCodes.ERROR_FAIL
    } finally {
      client.release()
    }
  },

  getById: async function (id) {
    let pool = db_pool.pool
    logger.info('pool :' + JSON.stringify(pool))
    let result = await pool.query('SELECT * FROM public.user WHERE id = $1', [id])
    return result
  },

  delete: async function (id) {
    let pool = db_pool.pool
    let result = await pool.query('DELETE FROM public.user WHERE id = $1', [id])
    return result
  },
  add: async function (user) {
    let pool = db_pool.pool
    // logger.info('pool :' + JSON.stringify(pool))
    let result = await pool.query('INSERT INTO public.user values ($1,$2)', [ user.name,
      user.age
    ])
    return result
  }
}

module.exports = User
