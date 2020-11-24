'use strict'

var mongo = require('./mongo')
const collection = mongo.collection('user',
  {
    username: { type: String, required: true }, // telno
    password: { type: String, required: true },
    status: { type: Number, required: true, default: 2 }, // 1 正常，2 只限于验证码登录，
    role: { type: String, required: true, default: 'guest' }, //  super， manager, user， guest
    tel: { type: String },
    location: {},
    create_time: { type: Date }, //
    modify_time: { type: Date } //
  })

module.exports = collection.model
