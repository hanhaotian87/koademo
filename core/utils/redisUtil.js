/**
 * Created by Michael Han on 18-7-2.
 */

var redis = require('redis')
var client = redis.createClient()
const { promisify } = require('util')
const getAsync = promisify(client.get).bind(client)
const logger = require('../../core/common/logger').logger(__filename)
// if you'd like to select database 3, instead of 0 (default), call
// client.select(3, function() { /* ... */ });
client.on('error', function (err) {
  logger.error('Error ' + err)
})

function setRecord (key, value, duration) {
  client.set(key, value, 'EX', duration, function (err, result) {
    logger.info('err:' + err + ' result :' + result)
  })
}

async function getRecord (key) {
  // eslint-disable-next-line no-return-await
  return await getAsync(key)
}

var randomVerifyCode = function () {
  var Num = ''
  for (var i = 0; i < 6; i++) {
    Num += Math.floor(Math.random() * 10)
  }
  logger.info('Num : ' + Num)
  return Num
}
module.exports = {
  setRecord: setRecord,
  getRecord: getRecord,
  randomVerifyCode: randomVerifyCode

}
