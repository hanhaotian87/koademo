/**
 * Created by Michael Han
 */
var UserDao = require('../dao/UserDao')
var logger = require('../common/logger').logger(__filename)
const ErrorCode = require('../common/ErrorCodes')
const commonUtil = require('../common/commonUtil')

async function login (username, password, clientType) {
  let user = await UserDao.findOne({ username: username, password: password }).exec()
  if (user) {
    var newToken = commonUtil.createToken(username, user.role, user._id)
    logger.info('newToken = ' + newToken)
    let result = {
      usreId: user._id,
      username: user.username,
      role: user.role,
      token: newToken
    }
    return result
  } else {
    return null
  }
}

async function addUser (userItem) {
  let user = await UserDao.findOne({ telno: userItem.username }).exec()
  logger.info('user:' + user + ' ' + JSON.stringify(userItem))
  if (user == null) {
    userItem.create_time = Date()// commonUtil.dateFormat(Date())
    let newUser = UserDao(userItem)
    let result = await newUser.save()
    logger.info('addUser result : ' + JSON.stringify(result))
    return result._id
  } else {
    logger.error('user has exist')
    return ErrorCode.ERROR_EXIST
  }
}

async function getUser (id, returnFields) {
  logger.info('fields ' + JSON.stringify(returnFields))
  let filter = { _id: id }
  if (!returnFields) {
    returnFields = {}
  }
  if (returnFields.password) {
    delete returnFields.password
  }
  logger.info('filter :' + JSON.stringify(filter) + ' fields ' + JSON.stringify(returnFields))
  let user = await UserDao.findOne(filter, returnFields).lean().exec()
  if (user) {
    delete user.password
    return user
  } else {
    logger.info('user not exist')
    return null
  }
}

async function getUsers (filter, returnFields, pageNo, pageSize, orderBy) {
  if (!returnFields) {
    returnFields = {}
  }
  if (returnFields.password) {
    delete returnFields.password
  }
  logger.info('filter :' + JSON.stringify(filter) + ' fields ' + JSON.stringify(returnFields))
  logger.info('pageNo :' + pageNo + ' pageSize ' + pageSize)
  let users = await UserDao.find(filter, returnFields).sort(orderBy)
    .skip((parseInt(pageNo, 10) - 1) * parseInt(pageSize, 10)).limit(parseInt(pageSize, 10)).lean().exec()
  let count = await UserDao.countDocuments(filter).exec()
  if (users) {
    users.forEach(user => {
      delete user.password
    })
    let result = { total: count, list: users }
    return result
  } else {
    logger.info('users not exist')
    let result = { total: 0 }
    return result
  }
}

async function updateUser (id, userReq) {
  let filter = { _id: id }
  let set = userReq
  set.modify_time = Date()// commonUtil.dateFormat(Date())
  let updateSet = { $set: set }
  let result = await UserDao.updateOne(filter,
    updateSet).exec()
  return result.ok // 1 修改成功，0 失败
}

async function deleteUser (id) {
  let filter = { _id: id }
  let result = await UserDao.deleteOne(filter).exec()
  logger.info('result : ' + JSON.stringify(result))// {"ok":1,"n":1,"deletedCount":1}
  return result.ok // 1 成功，0 失败
}

module.exports = {
  addUser: addUser,
  getUser: getUser,
  getUsers: getUsers,
  updateUser: updateUser,
  deleteUser: deleteUser,
  login: login
}
