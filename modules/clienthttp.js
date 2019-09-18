var http = require('http')
var qs = require('querystring')

var hostname = 'dev.cs7.ink'
if (process.env.NODE_ENV === 'production') {
  hostname = 'api.cs7.ink'
} else {
  hostname = 'dev.cs7.ink'
}
var options = {
  hostname: hostname,
  port: 80, // 80 //dev
  method: 'GET'
}

var clientGet = function (path, query) {
  let content = qs.stringify(query)
  options.path = path + '?' + content
  let p = new Promise(function (resolve, reject) {
    var req = http.request(options, function (res) {
      console.log('STATUS: ' + res.statusCode)
      // console.log('HEADERS: ' + JSON.stringify(res.headers))
      res.setEncoding('utf8')
      let data = ''
      res.on('data', function (chunk) {
        console.log('data: ')
        data = data + chunk
      })
      res.on('end', function () {
        console.log('end: ')
        resolve(data)
      })
    })

    req.on('error', function (e) {
      console.log('problem with request: ' + e.message)
      reject(e)
    })

    req.end()
  })
  return p
}

module.exports = { clientGet: clientGet }
