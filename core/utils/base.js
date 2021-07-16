/**
 * Created by Michael Han on 18-6-5.
 */

var iconv = require('iconv-lite')
const fs = require('fs')

var buffToBoolean = function (bufByte) {
  return bufByte !== 0
}

var byteToInt = function (bufByte) {
  return bufByte & 0xff
}

// byte 数组与 int 的相互转换
var byteArrayToInt = function (b) {
  let length = b.length
  if (length === 4) {
    return (
      (b[0] & 0xff) |
      ((b[1] & 0xff) << 8) |
      ((b[2] & 0xff) << 16) |
      ((b[3] & 0xff) << 24)
    )
  } else if (length === 2) {
    return (b[0] & 0xff) | ((b[1] & 0xff) << 8)
  } else {
    return b[0] & 0xff
  }
}

var byteArrayToString = function (b) {
  return stringRemoveMessyCode(iconv.decode(b, 'GBK'))
}

var stringRemoveMessyCode = function (source) {
  return source.replace(/\0.*/g, '')
}

let readFile = function (binPath) {
  var promise = new Promise(function (resolve, reject) {
    fs.readFile(binPath, function (err, data) {
      let result = { err: err, data: data }
      if (!err) {
        resolve(result)
      } else {
        reject(result)
      }
    })
  })
  return promise
}

module.exports = {
  buffToBoolean: buffToBoolean,
  stringRemoveMessyCode: stringRemoveMessyCode,
  byteToInt: byteToInt,
  byteArrayToInt: byteArrayToInt,
  byteArrayToString: byteArrayToString,
  readFile: readFile
}
