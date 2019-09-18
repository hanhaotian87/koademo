const axios = require('axios')

const instance = axios.create({
  baseURL: 'http://apis.juhe.cn',
  timeout: 1000
})

module.exports = instance
