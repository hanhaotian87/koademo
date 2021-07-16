const axios = require('axios')

const instance = axios.create({
  baseURL: /* 'http://localhost:3000' */  'http://ota.3jyun.com',  //'http://apis.juhe.cn',
  timeout: 1000,
  headers: {
    'Content-Type': 'application/octet-stream',
    Range: 'bytes=0-15'
  },
})

module.exports = instance
