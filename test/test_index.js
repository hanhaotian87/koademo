/* eslint-disable handle-callback-err */
/* eslint-disable no-undef */
const request = require('supertest')('http://localhost:3000')
var assert = require('assert')
const should = require('should')
var cipher = require('../core/common/cipher')
const logger = require('../core/common/logger').logger(__filename)
const data = require('../testData/data')

var token = ''
describe('koademo Api /login', function () {
  before('check http proxy ....', function (done) {
    // console.log('userid='+user.userid +'&password='+ md5(user.userid + md5(user.password)));
    request.post('/login')
      .send('username=' + data.user.username + '&password=' + cipher.md5(data.user.password)) // x-www-form-urlencoded upload
      .set('Accept', 'application/json')
      .expect(200)
      .end(function (err, res) {
        logger.info('res ' + JSON.parse(res.text).result.token)
        token = JSON.parse(res.text).result.token
        done()
      })
  })
  it('koademo Api /json', function (done) {
    request.get('/json').set('token', token).expect(200).end((err, res) => {
      if (err) throw err
      done()
    })
  })
})
