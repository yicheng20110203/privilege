import service from '@/utils/request'

/**
 * 列表 - 授权菜单树状结构
 */
export function getMenus() {
  return service.request({
    method: 'post',
    url: 'privilege/menu/list/tree/auth'
  })
}

/**
 * 列表 - 所有菜单树状结构
 */
export function getMenusAll() {
  return service.request({
    method: 'post',
    url: 'privilege/menu/list/tree/all'
  })
}

/**
 * 菜单添加
 * @param {*} data
*/
export function menuAdd(data) {
  return service.request({
    method: 'post',
    url: 'privilege/menu/add',
    data
  })
}

/**
 * 菜单修改
 * @param {*} data
 */
export function menuUpdate(data) {
  return service.request({
    method: 'post',
    url: 'privilege/menu/update',
    data
  })
}

/**
 * 菜单删除
 * @param {*} data
 */
export function menuDelete(data) {
  return service.request({
    method: 'post',
    url: 'privilege/menu/delete',
    data
  })
}

