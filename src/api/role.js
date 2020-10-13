import service from '@/utils/request'

/**
 * 角色列表
 */
export function getRoleList(data) {
  return service.request({
    method: 'post',
    url: 'privilege/role/list',
    data
  })
}

/**
 * 新增角色
 */
export function addRole(data) {
  return service.request({
    method: 'post',
    url: 'privilege/role/add',
    data
  })
}

/**
 * 修改角色
 */
export function updateRole(data) {
  return service.request({
    method: 'post',
    url: 'privilege/role/update',
    data
  })
}

/**
 * 删除角色
 */
export function deleteRole(data) {
  return service.request({
    method: 'post',
    url: 'privilege/role/delete',
    data
  })
}
/**
 * 删除角色
 */
export function getRoleAuthTree(data) {
  return service.request({
    method: 'post',
    url: 'privilege/power/list/tree/auth',
    data
  })
}
