var Mock = require('mockjs')
var Random = Mock.Random
var data = {
  user: {
    username: 'koademo',
    password: '123456',
    time: Random.now()
  }

}
module.exports = data
