/**
 * Created by Michael Han on 18-6-5.
 */

var iconv = require('iconv-lite')

var buffToBoolean = function (bufByte) {
  return bufByte !== 0
}

var byteToInt = function (bufByte) {
  return bufByte & 0xFF
}

// byte 数组与 int 的相互转换
var byteArrayToInt = function (b) {
  let length = b.length
  if (length === 4) {
    return b[0] & 0xFF |
        (b[1] & 0xFF) << 8 |
        (b[2] & 0xFF) << 16 |
        (b[3] & 0xFF) << 24
  } else if (length === 2) {
    return b[0] & 0xFF |
        (b[1] & 0xFF) << 8
  } else {
    return b[0] & 0xFF
  }
}

var byteArrayToString = function (b) {
  return stringRemoveMessyCode(iconv.decode(b, 'GBK'))
}

var stringRemoveMessyCode = function (source) {
  return source.replace(/\0.*/g, '')
}

module.exports = {
  buffToBoolean: buffToBoolean,
  stringRemoveMessyCode: stringRemoveMessyCode,
  byteToInt: byteToInt,
  byteArrayToInt: byteArrayToInt,
  byteArrayToString: byteArrayToString
}
