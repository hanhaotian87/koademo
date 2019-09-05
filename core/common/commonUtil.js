var jwt = require('jsonwebtoken')
var fs = require('fs')
var path = require('path')
var dFormat = require('dateformat')

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
* @param sinStr 签名字符串
* @param regionId 区Id
* @returns {string}加密密码
*/
module.exports.createToken = function (sinStr, role, id) {
  var content = { msg: 'koademo', role: role, id: id }
  var token = jwt.sign(content, sinStr, {
    expiresIn: 60 * 60 * 24 // 30分钟过期
  })
  // console.log("deviceid: "+sinStr+" token: "+token);
  console.log('token expiresIn: ' + token.expiresIn)
  return token
}

/**
 * 核验login token
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

/**
 * 核验login token
 * @param token str 字符串
 * @returns {boolean}
 */
module.exports.decodeToken = function (token) {
  let decoded = jwt.decode(token, { complete: true })
  console.log(decoded.header)
  console.log(decoded.payload)
  return decoded.payload
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

// Bot, MobileBot, DesktopMode, TV, WebKit, Console, Watch
module.exports.getDeviceType = function (md) {
  if (md.is('DesktopMode')) {
    return 1
  } else if (md.is('Bot') || md.is('MobileBot')) {
    return 2
  } else {
    return 3
  }
}

module.exports.dateFormat = function (date) {
  return dFormat(date, 'yyyy-mm-dd HH:MM:ss l')
}

module.exports.filterDeterminer = function (query) {
  delete query.pageNo
  delete query.pageSize
  delete query.orderBy
  delete query.asc
  delete query.groupBy
  delete query.likes
  delete query.fields
  delete query.by
  return query
}

module.exports.filterFields = function (fields, allSupport) {
  console.log('fields ' + fields + ' allSupport :' + allSupport)
  let returnFields = {}
  if (fields) {
    let fieldArr = fields.split(',')
    if (allSupport) {
      let allArr = allSupport.split(',')
      for (const field of fieldArr) {
        for (const item of allArr) {
          if (field === item) {
            returnFields[field] = 1
          }
        }
      }
    } else {
      for (const field of fieldArr) {
        returnFields[field] = 1
      }
    }
  }
  return returnFields
}

var getQ = function (q, supportQuery) {
  let filter = {}
  if (q) {
    let qArr = q.split(';')
    let sArr = supportQuery.split(',')
    let newArr = []
    // eslint-disable-next-line no-labels
    main : for (let item of qArr) {
      for (let i = 0; i < sArr.length; i++) {
        let reg = new RegExp('^' + '!?' + sArr[i])//! 有或无
        if (item.match(reg)) {
          newArr.push(item)
          // eslint-disable-next-line no-labels
          continue main
        }
      }
    }

    for (const item of newArr) {
      console.log('item :' + JSON.stringify(item))
      if (item.match('∩')) {
        let objArr = item.split('∩')
        if (objArr && objArr.length >= 2) {
          let orValues = []
          for (const obj of objArr) {
            orValues.push(getQ(obj, supportQuery))
          }
          filter['$and'] = orValues
        }
      } else if (item.match('∪')) {
        let objArr = item.split('∪')
        if (objArr && objArr.length >= 2) {
          let orValues = []
          for (const obj of objArr) {
            let item = getQ(obj, supportQuery)
            console.log('item :' + JSON.stringify(item))
            orValues.push(item)
          }
          filter['$or'] = orValues
        }
      } else if (item.match('!=')) {
        let objArr = item.split('!=')
        if (objArr && objArr.length === 2) {
          let values = objArr[1].split(',')
          if (values.length === 1) {
            filter[objArr[0]] = { $ne: objArr[1] }
          } else {
            filter[objArr[0]] = { $nin: values }
          }
        }
      } else if (item.match('>=')) {
        let objArr = item.split('>=')
        if (objArr && objArr.length === 2) {
          filter[objArr[0]] = { $gte: objArr[1] }
        }
      } else if (item.match('<=')) {
        let objArr = item.split('<=')
        if (objArr && objArr.length === 2) {
          filter[objArr[0]] = { $lte: objArr[1] }
        }
      } else if (item.match('>')) {
        let objArr = item.split('>')
        if (objArr && objArr.length === 2) {
          filter[objArr[0]] = { $gt: objArr[1] }
        }
      } else if (item.match('<')) {
        let objArr = item.split('<')
        if (objArr && objArr.length === 2) {
          filter[objArr[0]] = { $lt: objArr[1] }
        }
      } else if (item.match('≈')) {
        let objArr = item.split('≈')
        if (objArr && objArr.length === 2) {
          filter[objArr[0]] = new RegExp(objArr[1])
          console.log(objArr[0] + '≈' + filter[objArr[0]])
        }
      } else if (item.match('=')) {
        let objArr = item.split('=')
        if (objArr && objArr.length === 2) {
          let values = objArr[1].split(',')
          if (values.length === 1) {
            filter[objArr[0]] = objArr[1]
          } else {
            filter[objArr[0]] = { $in: values }
          }
        }
      } else if (item.match(/^!+/)) {
        let key = item.replace(/^!+/, '')
        filter[key] = { $exists: false }
      } else {
        filter[item] = { $exists: true }
      }
    }
  }

  console.log('filter :' + JSON.stringify(filter))
  return filter
}

module.exports.getQ = getQ

module.exports.isObjectId = function (id) {
  let idReg = new RegExp(/^[0-9a-z]{24}$/)
  console.log('idReg :' + idReg.test(id))
  return idReg.test(id)
}

module.exports.isTelno = function (telno) {
  let telnoReg = new RegExp(/^1\d{10}$/)
  return telnoReg.test(telno)
}

module.exports.objIsNull = function (obj) {
  if (obj) {
    for (var key in obj) {
      return false
    }
    return true
  } else {
    return true
  }
}

module.exports.deleteUndefined = function (obj) {
  Object.keys(obj).forEach(function (key) {
    if (typeof obj[key] === 'undefined') {
      delete obj[key]
    }
  })
  return obj
}

module.exports.delExtension = function (str) {
  var reg = /\.\w+$/
  return str.replace(reg, '')
}
