const { Pool } = require('pg')
// const url = require('url')

// const params = url.parse(process.env.DATABASE_URL)
// const auth = params.auth.split(':')

const config = {
  user: 'Michael Han',
  password: '1234',
  host: 'localhost',
  port: 5432,
  database: 'test1',
  ssl: false,
  max: 15 // default 10
}

const pool = new Pool(config)

async function client () { // 通过连接池获取client,采用事务时使用，使用完需要release
  let client = await pool.connect()
  return client
}

module.exports = {
  client: client,
  pool: pool
}
