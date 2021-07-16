'use strict'

/**
 * 接口相关服务。
 */

module.exports = {
  msgGet,
  msgPost,
  msgPut,
  msgDelete
}

const async = require('async')

const axios = require('axios').default
axios.defaults.headers.post['Content-Type'] = 'application/json; charset=utf-8'
axios.defaults.timeout = 5000
axios.defaults.withCredentials = false
axios.defaults.forever = true

/**
 * 各方法发送消息到指定URL。方法如'GET'||'POST'||'PUT'||'DELETE'
 * @param url URL
 * @param msgStr 消息
 * @param headers 响应头
 * @param callback
 * @returns {*}
 */
function msgGet (url, msgStr, headers, callback) {
  return sendReq2Url(url, msgStr, headers, 'GET', callback)
}
function msgPost (url, msgStr, headers, callback) {
  return sendReq2Url(url, msgStr, headers, 'POST', callback)
}
function msgPut (url, msgStr, headers, callback) {
  return sendReq2Url(url, msgStr, headers, 'PUT', callback)
}
function msgDelete (url, msgStr, headers, callback) {
  return sendReq2Url(url, msgStr, headers, 'DELETE', callback)
}
function sendReq2Url (url, msgStr, headers, method, callback) {
  if (callback) {
    return sendReq(url, msgStr, headers, method, callback)
  } else {
    return sendReqAsync(url, msgStr, headers, method)
  }
}
function sendReq (url, msgStr, headers = {}, method = 'POST', callback) {
  async.retry(
    { times: 3, interval: 1000 },
    function (callback, results) {
      let options = {
        url,
        headers,
        data: msgStr,
        method
      }
      axios(options)
        .then((response) => {
          let statusCode = response.status
          if (statusCode < 200 || statusCode >= 300) {
            const err = new Error('statusCode=' + statusCode)
            err.response = response
            return callback(err)
          }
          return callback(null, response)
        })
        .catch((error) => {
          return callback(error)
        })
    },
    callback
  )
}
function sendReqAsync (url, msgStr, headers, method) {
  return new Promise(function (resolve, reject) {
    try {
      sendReq(url, msgStr, headers, method, function (err, response) {
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

