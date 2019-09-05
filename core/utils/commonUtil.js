var jwt = require('jsonwebtoken')
var fs = require('fs')
var path = require('path')

/**
 * 获取配置文件路径
 * @returns {string}
 */
exports.getConfigPath = function () {
  var configPath = process.cwd() + '/config'
  var applicationPath = process.argv.splice(4)
  if (applicationPath.length > 0) {
    applicationPath = applicationPath[0]
    applicationPath = applicationPath.split('=')
    applicationPath = applicationPath[1]
    configPath = applicationPath + '/config'
  }
  return configPath
}

/**
* 生成login token
* @param str 字符串
* @returns {string}加密密码
*/
module.exports.createToken = function (sinStr) {
  var content = { msg: 'fhsj_project_manager' }
  var token = jwt.sign(content, sinStr, {
    expiresIn: 60 * 60 * 24 // 30分钟过期
  })
  // console.log("deviceid: "+sinStr+" token: "+token);
  console.log('token expiresIn: ' + token.expiresIn)
  return token
}

/**
 * 生成login token
 * @param token str 字符串
 * @returns {boolean}
 */
module.exports.checkTokenValid = function (token, sinStr) {
  // console.log("checkTokenValid "+sinStr + "  " + token.expiresIn);
  var ret = false
  jwt.verify(token, sinStr, function (err, decode) {
    if (err) { //  时间失效的时候/ 伪造的token
      console.log('token check error: ' + err.expiredAt)
      ret = false
    } else {
      // console.log(decode.msg);
      ret = true
    }
  })
  return ret
}

module.exports.getRootPath = function () {
  var rootPath = process.cwd()
  var applicationPath = process.argv.splice(4)
  if (applicationPath.length > 0) {
    applicationPath = applicationPath[0]
    applicationPath = applicationPath.split('=')
    applicationPath = applicationPath[1]
    rootPath = applicationPath
  }
  return rootPath
}

module.exports.mkdirsSync = _mkdirsSync

function _mkdirsSync (dirname) {
  console.log('创建文件夹：' + dirname)
  if (!fs.existsSync(dirname)) {
    if (_mkdirsSync(path.dirname(dirname))) {
      fs.mkdirSync(dirname)
    }
  }
}

module.exports.deleteDirSync = _deleteDir
function _deleteDir (filePath) {
  var files = []
  if (fs.existsSync(filePath)) {
    files = fs.readdirSync(filePath)
    files.forEach(function (file, index) {
      var curPath = filePath + '/' + file
      if (fs.statSync(curPath).isDirectory()) {
        _deleteDir(curPath)
      } else {
        fs.unlinkSync(curPath)
      }
    })
    fs.rmdirSync(filePath)
  }
}

module.exports.getIPAdress = getIPAdress

function getIPAdress () {
  var interfaces = require('os').networkInterfaces()
  for (var devName in interfaces) {
    var iface = interfaces[devName]
    for (var i = 0; i < iface.length; i++) {
      var alias = iface[i]
      if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal) {
        return alias.address
      }
    }
  }
}
