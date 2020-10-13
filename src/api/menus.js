import service from '@/utils/request'

/**
 * 获取用户菜单
 */
export function getMenus() {
  return service.request({
    method: 'post',
    url: 'privilege/menu/list/tree/auth'
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

