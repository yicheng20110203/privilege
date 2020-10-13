import service from '@/utils/request'

/**
 * 获取管理员用户列表
 */
export function getAdminUserList(data) {
  return service.request({
    method: 'post',
    url: 'privilege/user/list',
    data
  })
}

/**
 * 管理员添加
 */
export function adminUserAdd(data) {
  return service.request({
    method: 'post',
    url: 'privilege/user/add',
    data
  })
}

/**
 * 管理员修改
 */
export function adminUserUpdate(data) {
  return service.request({
    method: 'post',
    url: 'privilege/user/update',
    data
  })
}

/**
 * 管理员删除
 */
export function adminUserDelete(data) {
  return service.request({
    method: 'post',
    url: 'privilege/user/delete',
    data
  })
}
