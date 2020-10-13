import service from '@/utils/request'

/**
 * 自动登录
 */
export function getInfo() {
  return service.request({
    method: 'post',
    url: 'privilege/user/login'
  })
}

/**
 * 用户列表
 */
export function getUserList(data) {
  return service.request({
    method: 'post',
    url: 'privilege/user/list',
    data
  })
}

/**
 * 账户添加
 */
export function UserAdd(data) {
  return service.request({
    method: 'post',
    url: 'privilege/user/add',
    data
  })
}

/**
 * 账户修改
 */
export function UserUpdate(data) {
  return service.request({
    method: 'post',
    url: 'privilege/user/update',
    data
  })
}

/**
 * 账户退出
 */
export function logout() {
  return service.request({
    method: 'post',
    url: 'privilege/user/logout'
  })
}
