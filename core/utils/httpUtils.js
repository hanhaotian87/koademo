'use strict'

module.exports = {
  post: function (addr, path, deviceId, deviceSecret, payload, callback) {
    if (callback) {
      return post(addr, path, deviceId, deviceSecret, payload, callback)
    } else {
      return postAsync(addr, path, deviceId, deviceSecret, payload)
    }
  },
  get: getAsync,
  head: headAsync
}

const request = require('request')
const Promise = require('bluebird')
const async = require('async')
const cipher = require('../misc/cipher')
const querystring = require('querystring')
const logger = require('../log')(__filename)

const call = request.defaults({
  method: 'POST',
  headers: {
    'content-type': 'application/json'
  },
  forever: true
})

/**
 * 异步投递消息到RSS。
 * @param url
 * @param deviceType 设备类型
 * @param deviceId 设备ID
 * @param channel 消息通道（Dat, Alm, Rcv）
 * @param payload 消息内容（Buffer）
 * @returns {Promise}
 */
function postAsync (addr, path, deviceId, deviceSecret, payload) {
  return new Promise(function (resolve, reject) {
    try {
      post(
        addr,
        path,
        deviceId,
        deviceSecret,
        payload,
        function (err, response) {
          if (err) {
            reject(err)
          } else {
            resolve(response)
          }
        }
      )
    } catch (err) {
      reject(err)
    }
  })
}

/**
 * 投递消息到RSS
 * @param deviceType 设备类型
 * @param deviceId 设备ID
 * @param channel 消息通道（Dat, Alm, Rcv）
 * @param payload 消息内容（Buffer）
 * @param callback function (err, res)
 * @return {*}
 */
function post (addr, path, deviceId, deviceSecret, payload, callback) {
  return pub(addr, path, deviceId, deviceSecret, payload, callback)
}

/**
 * 发布消息到RSS
 * @param topic 消息类型：3jyun_alm, 3jyun_dat
 * @param tag 设备类型（deviceType）
 * @param deviceId 设备ID
 * @param payload 消息内容Buffer
 * @param callback
 */
function pub (addr, path, deviceId, deviceSecret, payload, callback) {
  const ts = Date.now()
  async.retry(
    { times: 3, interval: 1500 },
    function (callback, results) {
      call(
        {
          uri: addr + path,
          headers: {
            'content-type': 'application/json;charset=utf-8',
            Signature: cipher.md5(path + ts + deviceSecret),
            Timestamp: ts + '',
            DeviceId: deviceId
          },
          body: JSON.stringify(payload)
        },
        function (error, response, body) {
          if (error) {
            return callback(error)
          }
          const statusCode = response.statusCode
          if (statusCode < 200 || statusCode >= 300) {
            const err = new Error('statusCode=' + statusCode)
            err.response = response
            return callback(err)
          }
          return callback(null, response)
        }
      )
    },
    callback
  )
}

/**
 * 异步获取。
 * @param addr 域名地址
 * @param path path
 * @param params 参数
 * @returns {Promise}
 */
function getAsync (addr, path, params, header) {
  return new Promise(function (resolve, reject) {
    try {
      get(addr, path, params, header, function (err, response) {
        if (err) {
          reject(err)
        } else {
          resolve(response)
        }
      })
    } catch (err) {
      reject(err)
    }
  })
}

/**
 * 获取
 * @param addr 域名地址
 * @param path path
 * @param params 参数
 * @param callback
 */
function get (addr, path, params, header, callback) {
  async.retry(
    { times: 3, interval: 200 },
    function (callback) {
      const headers = {
        'content-type': 'application/json;charset=utf-8'
      }
      Object.assign(headers, header)
      let uri = addr + path
      if (params) {
        uri = uri + '?' + querystring.stringify(params)
      }
      logger.debug('uri :' + uri + ' headers:' + JSON.stringify(headers))
      call(
        {
          method: 'GET',
          uri: uri,
          headers: headers
        },
        function (error, response) {
          if (error) {
            return callback(error)
          }
          const statusCode = response.statusCode
          if (statusCode < 200 || statusCode >= 300) {
            const err = new Error('statusCode=' + statusCode)
            err.response = response
            return callback(err)
          }
          return callback(null, response)
        }
      )
    },
    callback
  )
}

/**
 * 异步head。
 * @param addr 域名地址
 * @param path path
 * @param params 参数
 * @returns {Promise}
 */
function headAsync (url) {
  return new Promise(function (resolve, reject) {
    try {
      head(url, function (err, response) {
        if (err) {
          reject(err)
        } else {
          resolve(response)
        }
      })
    } catch (err) {
      reject(err)
    }
  })
}

/**
 * head
 * @param addr 域名地址
 * @param path path
 * @param params 参数
 * @param callback
 */
function head (url, callback) {
  async.retry(
    { times: 3, interval: 200 },
    function (callback) {
      call(
        {
          method: 'HEAD',
          uri: url,
          headers: {
            'content-type': 'application/json;charset=utf-8'
          }
        },
        function (error, response) {
          if (error) {
            return callback(error)
          }
          const statusCode = response.statusCode
          if (statusCode < 200 || statusCode >= 300) {
            const err = new Error('statusCode=' + statusCode)
            err.response = response
            return callback(err)
          }
          return callback(null, response)
        }
      )
    },
    callback
  )
}
