const http = require('http')
const qs = require('querystring')
const logger = require('../common/logger').logger(__filename)

var mqProducerPostHttp = function (path, query, body) {
  // 通过http把需要推送的消息发送给MqPub.jar处理
  let options = {
    hostname: 'localhost',
    port: 3000,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
      'Content-Length': Buffer.byteLength(body)
    }
  }
  let content = qs.stringify(query)
  options.path = path + '?' + content
  let p = new Promise(function (resolve, reject) {
    let req = http.request(options, function (res) {
      logger.info('PATH:' + options.path + ' STATUS: ' + res.statusCode)
      // console.log('HEADERS: ' + JSON.stringify(res.headers))
      res.setEncoding('utf8')
      let data = ''
      res.on('data', function (chunk) {
        // logger.info('data: ')
        data = data + chunk
      })
      res.on('end', function () {
        // logger.info('end: ')
        resolve(data)
      })
    })

    req.on('error', function (e) {
      logger.error('problem with request: ' + e.message)
      reject(e)
    })
    req.write(body)
    req.end()
  })
  return p
}

module.exports = {
  mqProducerPostHttp: mqProducerPostHttp
}
