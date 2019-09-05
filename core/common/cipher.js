'use strict'

/**
 * Created by Michael Han on 2019/03/01.
 */

module.exports = {
  textEncrypt: textEncrypt,
  textDecrypt: textDecrypt,
  encrypt: encrypt,
  decrypt: decrypt,
  md5: md5
}

const crypto = require('crypto')

const _algorithm = 'aes-256-ecb'
const _keySize = 32 // 算法要求的密钥长度
const _encoding = 'utf-8'

/**
 * 密钥补齐32字节(aes-256-ecb)
 * @param key 原始密钥
 * @returns {*} 补齐32字节后的密钥
 */
function paddingKey (key) {
  key = key || ''
  while (key.length < _keySize) {
    key += ' '
  }
  return key.substr(0, _keySize)
}

/**
 * 加密。
 * @param text 输入数据，Buffer对象。
 * @param key 加密密钥。
 * @return {string} 返回加密后的数据，hex字符串格式。
 */
function textEncrypt (text, key) {
  let encrypted = ''
  const cipher = crypto.createCipheriv(_algorithm, Buffer.from(paddingKey(key), _encoding), '')
  encrypted += cipher.update(Buffer.from(text, _encoding), null, 'hex')
  encrypted += cipher.final('hex')
  return encrypted
}

/**
 * 解密。
 * @param text 加密串，base64字符串格式。
 * @param key 密钥。
 * @return {string} 返回解密后的字符串。
 */
function textDecrypt (text, key) {
  let decrypted = ''
  const cipher = crypto.createDecipheriv(_algorithm, Buffer.from(paddingKey(key), _encoding), '')
  decrypted += cipher.update(text, 'hex', _encoding)
  decrypted += cipher.final(_encoding)
  return decrypted
}

/**
 * aes128加密,java能对应上
 * @param data     明文
 * @param secretKey  密钥
 * @returns {*}
 */
function encrypt (data, secretKey) {
  var cipher = crypto.createCipheriv('aes-128-ecb', secretKey, '')
  return cipher.update(data, 'utf8', 'hex') + cipher.final('hex')
}

/**
 * aes128解密，java能对应上
 * @param data        密文
 * @param secretKey     密钥
 * @returns {*}
 */
function decrypt (data, secretKey) {
  var cipher = crypto.createDecipheriv('aes-128-ecb', secretKey, '')
  return cipher.update(data, 'hex', 'utf8') + cipher.final('utf8')
}

/**
 * 返回文本text的md5摘要。
 *
 * @param text
 *            源文本。
 * @returns 返回文本的md5摘要（32字节16进制字符串）
 */
function md5 (text) {
  const buf = Buffer.from(text, _encoding) // 需要转成Buffer，否则，对有汉字的text，会有问题。
  return crypto.createHash('md5').update(buf).digest('hex')
}
