module.exports = {
  connectionLimit: 3,
  queueLimit: 100,
  host: 'localhost',
  user: 'han',
  password: '1234',
  database: 'cs7'
}

// Error too many connections 解决办法，修改windows C:\ProgramData\MySQL\MySQL Server 5.7\my.ini  linux /etc/my.conf
// max_connections=500 最大连接数  wait_timeout = 100 等待关闭连接的时间,单位s 秒
