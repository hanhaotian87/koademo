/**
 * Created by liuzh on 2017/02/27.
 */

'use strict'

module.exports = {
  put: put,
  get: get,
  del: del,
  set: set,
  inc: inc,
  mset: mset,
  push: push,
  pop: pop,
  size: size,
  watch: watch,
  unwatch: unwatch,
  multi: multi,
  gets: gets,
  sets: sets,
  expire: expire,
  setnx: setnx,
  close: close
}

// const co = require('co');
const Promise = require('bluebird')
const redis = require('redis')
const conf = {
  host: '127.0.0.1',
  port: 6379
}

Promise.promisifyAll(redis.RedisClient.prototype)
Promise.promisifyAll(redis.Multi.prototype)

const client = redis.createClient({
  host: conf.host,
  port: conf.port,
  db: 1,
  password: conf.password,
  socket_keepalive: true,
  string_numbers: false
})

client.on('error', function (err) {
  console.log('Err: ', err)
})

/**
 * 设置key为指定对象（hash）
 * @param key 对象主键
 * @param obj 对象（不能为多级对象）
 */
async function put (key, obj) {
  try {
    await client.hmsetAsync(key, obj)
    return {
      key: key,
      obj: obj
    }
  } catch (err) {
    console.log('error:put("%s") failed[rediscli.js/put]!', key)
    return null
  }
}

/**
 * 获取key代表的对象（hash）
 * @param key 对象主键
 */
async function get (key) {
  try {
    const obj = await client.hgetallAsync(key)
    return {
      key: key,
      obj: obj
    }
  } catch (err) {
    console.log('error:get("%s") failed[rediscli.js/get]!', key)
    return null
  }
}

/**
 * 删除指定的key
 * @param key 对象主键
 */
function del (key) {
  return client.delAsync(key)
}

/**
 * 设置指定对象指定字段的值
 * @param key 对象主键
 * @param field 字段名
 * @param value 值（简单类型：字符串、数值、布尔等）
 */
function set (key, field, value) {
  return client.hmsetAsync(key, field, value)
}

/**
 * 同时设置指定对象的多个字段值
 * @param key 对象主键
 * @param feildValues 数组，元素为：字段名1，字段值1，字段名2，字段值2，...
 */
function mset (key, feildValues) {
  return client.hmsetAsync(key, feildValues)
}

/**
 * 递增指定对象指定字段的值。
 * @param key 对象主键
 * @param field 字段名
 * @param step 增量（数值类型）
 */
function inc (key, field, step) {
  return client.hincrbyAsync(key, field, step || 1)
}

/**
 * 向指定列表追加元素
 * @param key 列表主键
 * @param value 元素值
 */
function push (key, value) {
  return client.rpushAsync(key, value)
}

/**
 * 从指定列表弹出元素
 * @param key 列表主键
 */
function pop (key) {
  return client.lpopAsync(key)
}

/**
 * 获取指定列表元素个数
 * @param key 列表主键
 */
function size (key) {
  return client.llenAsync(key)
}

function watch (key) {
  return client.watch(key)
}

function unwatch () {
  return client.unwatch()
}

function multi () {
  return client.multi()
}

function gets (key) {
  return client.getAsync(key)
}

function sets (key, value, ...args) {
  return client.setAsync(key, value, ...args)
}

function expire (key, seconds) {
  if (seconds) {
    client.expire(key, seconds)
  }
}

function setnx (key, value) {
  return client.setnxAsync(key, value)
}
/**
 * 关闭redis客户端。
 */
function close () {
  return client.quitAsync()
}
