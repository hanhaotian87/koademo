var crypto = require('crypto')
//鸿茂项目魔方泛海三江智慧消防云平台APP 申请的私钥
const privateKey =
  '-----BEGIN PRIVATE KEY-----\n' +
  'MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCQEQqbipD1AEesuzeqPUd8p51y\n' +
  'HOBRZj/o+YFuAN23ZE9atgIBjXoKCXyeBHxP81urdqxj0BQQMSjDvqEZbsmKgmTBuFlvOkZoTmDV\n' +
  'UddgnCHRSIWWvQnu1r0tgr0EEa1kFYDBfQwSzo2IsQJcRNduoMg9fbMjFcMpoSMkaJvy6IRz+ueH\n' +
  'FyA2oLXOJ5bISaCJvKoddd18ds+m0WsJEidJLn2B1rKlAmdTPEp9OnqKaHBDViJFJH1BcWp+4l3r\n' +
  'bRRJqbUzF2hBpI2Q6Q4mRabs+KnjSdt4k6tIoT8ZmGhXFqdDhpRgVT6IzyR7hEK6MSXKOSpfxC50\n' +
  'Nd5Mv0LPnMLNAgMBAAECggEAGMUVUdDtQ3Kc4DIATCDlHaWkCG62kshFzMS5YDR96n4wtqP8jE/K\n' +
  '39bpujGDPivVYxGwaijoijAplh48jKbjuBDbSgNsPReD64MuWv8LTO0LU3Roo5Y1Ev+Q3zZPUVfI\n' +
  'vCCGVr4tST6CTzI/+aVMdRTn2Mq39hxTxeCSrjveNFFJZE9eSXIBfkuhSZaHSAyGAQI5cI7bIpgY\n' +
  'gzEWLI2QpuILg/LtS2CAYJdoU3P/g7mIfLTZl3BwFwc5cwTJbs2xpBVAnOAlXxZiazUuYDyfQiUJ\n' +
  'emebkeSErKCC7QbhnqGfyARmVHXFVv3X5pxx0AmVYH+mzGY4uyP0jLyaZzuLcQKBgQD+tEyb72CM\n' +
  'n/fdFzc9CwNpHl9CRrIiLeYROMVo30Jcj50M/n1FJfdfQJyFb3IArK0EvhVCYAM7nrmUXnuN2sCx\n' +
  'qFxgF1dslSzhAEU0J/5e/dCZQoolcHhYNgF5ackU/zyJ3qcLQv5kKSm0ztRk60c3ilF9EHQZb3NV\n' +
  '66bBxH5lQwKBgQCQzKixWy69Yo/GJedVgB5dpMs4VofZzv3oP9hcANUJDmLD5IgzduoMgDn3hDAw\n' +
  'oC9Ie2iJGeIbkgMpl2ZB2irI6sF1DHcjxI4tZGRiL3cvPmT2A4Hetdx4ZaiY8L7oWMcoWlPN+s3F\n' +
  'F1OsGOnWEqF4PoS6ZRmfB4+9WEElQvaurwKBgHszEutKOlVK+0WB+UIZlai+/Cy+rWNC+EnUQAie\n' +
  'FSdYgArM/iL4XlNAmXUhlu8klvv4Rag5cNbhy7osiW7wJMzKNwRzxeHLtk2PJ+o2fh/MfZ3kRZYe\n' +
  'dNeWJ9hmhtEVNF8rx3j3Cr2/+2Btuualt2jyCsCHuOCkvBEPTzXiqZCpAoGAWkb/NfR/o5v7v7KK\n' +
  'FIiYZhIEkc+BS47+RvrnThVGvSq28SNet5eAPOMFQQitcuOsFyi5+CCnFEFor1mxa4U1/6Y9j1iC\n' +
  'P06gxjQ9Uen+CPqBv9BX/B6uonHfN9uBayNOqB4I+fdQq3zrsfSmdc2P1oREBGJcIwZ327lWhIDH\n' +
  'hAkCgYEA3Ddi5R8g2DPxmRhWnZc09GKbovEgzutBa2LZBzHT+coEV5A9gslPy9zuKXNYGbudR9vj\n' +
  '1BhGibSd2enrH4+namTS+mHLPsgBsl5I/ZEpwS3LkaCG8lJMRlJ0Qhzr6vOndycw9QqXXGzGZ9fo\n' +
  'wfpHOCYZ7FgJHet5UHwwE9bWrA0=' +
  '\n-----END PRIVATE KEY-----'

//鸿茂项目魔方泛海三江智慧消防云平台APP 申请的公钥
const publicKey =
  '-----BEGIN PUBLIC KEY-----\n' +
  'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAkBEKm4qQ9QBHrLs3qj1HfKedchzgUWY/\n' +
  '6PmBbgDdt2RPWrYCAY16Cgl8ngR8T/Nbq3asY9AUEDEow76hGW7JioJkwbhZbzpGaE5g1VHXYJwh\n' +
  '0UiFlr0J7ta9LYK9BBGtZBWAwX0MEs6NiLECXETXbqDIPX2zIxXDKaEjJGib8uiEc/rnhxcgNqC1\n' +
  'zieWyEmgibyqHXXdfHbPptFrCRInSS59gdaypQJnUzxKfTp6imhwQ1YiRSR9QXFqfuJd620USam1\n' +
  'MxdoQaSNkOkOJkWm7Pip40nbeJOrSKE/GZhoVxanQ4aUYFU+iM8ke4RCujElyjkqX8QudDXeTL9C\n' +
  'z5zCzQIDAQAB' +
  '\n-----END PUBLIC KEY-----'

function createSign(data, privateKey) {
  const sign = crypto.createSign('SHA256')
  sign.update(data)
  sign.end()
  return sign.sign(privateKey).toString('base64')
}

function objKeySort(obj) {
  //排序的函数
  var newkey = Object.keys(obj).sort() //先用Object内置类的keys方法获取要排序对象的属性名，再利用Array原型上的sort方法对获取的属性名进行排序，newkey是一个数组
  var newObj = {} //创建一个新的对象，用于存放排好序的键值对
  for (var i = 0; i < newkey.length; i++) {
    //遍历newkey数组
    newObj[newkey[i]] = obj[newkey[i]] //向新创建的对象中按照排好的顺序依次增加键值对
  }
  return newObj //返回排好序的新对象
}

function getContent(params) {
  let sortParams = objKeySort(params)
  let content = ''
  for (let key in sortParams) {
    content = content + key + '=' + sortParams[key]
  }
  console.log('content :' + content)
  return content
}

/**
 * params 参数为json对象，对象内属性值如果为对象需要迭代对值进行JSON.stringify()转化为字符串
 * eg. params = {
 *		appId:'1e4723c77f9b4e219afded16c62609d2',
 *		appKey:'915004c4e3cc4fd9ae2c151686234e76',
 *		signType:'RSA2',
 *		openId:'1410079027482361856',
 *		familyId:'1410083166425337856',
 *		timeStamp:'1626244236126',
 *		version:'1.0',
 *		deviceMac:'868591052320909',
 *		accessTokenC:'fd802af80c82468691a908d6686ee17d',
 *		command:JSON.stringify({val:'VOICE_MUTE',func:JSON.stringify({clearAlarmSound:'1'})})
 *	}
 * prvKey为魔方平台应用privateKey
 *
 */
function sign(params, prvKey) {
  let vKey = privateKey
  if (prvKey) {
    vKey = prvKey
  }
  let content = getContent(params)
  return createSign(content, vKey)
}

function test1() {
  let params = {
    appId: '1e4723c77f9b4e219afded16c62609d2',
    appKey: '915004c4e3cc4fd9ae2c151686234e76',
    signType: 'RSA2',
    openId: '1410079027482361856',
    familyId: '1410083166425337856',
    timeStamp: '1626244236126',
    version: '1.0',
    deviceMac: '868591052320909',
    accessTokenC: 'fd802af80c82468691a908d6686ee17d',
    command: JSON.stringify({
      val: 'VOICE_MUTE',
      func: JSON.stringify({ clearAlarmSound: '1' }),
    }),
  }
  let result = sign(params, privateKey)
  console.log(result)
}

test1()
