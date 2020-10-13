import service from '@/utils/request'

/**
 * 列表 - 菜单路由关系
 */
export function getMenuBackUrlList(data) {
  return service.request({
    method: 'post',
    url: 'privilege/menu/back/url/list',
    data
  })
}

/**
 * 添加 - 菜单路由关系
 * @param {*} data
 */
export function getMenuBackUrlAdd(data) {
  return service.request({
    method: 'post',
    url: 'privilege/menu/back/url/add',
    data
  })
}

/**
 * 批量添加 - 菜单路由关系
 * @param {*} data
 */
export function getMenuBackUrlBatchAdd(data) {
  return service.request({
    method: 'post',
    url: 'privilege/menu/back/url/add/multi',
    data
  })
}

/**
 * 修改 - 菜单路由关系
 * @param {*} data
 */
export function MenuBackUrlUpdate(data) {
  return service.request({
    method: 'post',
    url: 'privilege/menu/back/url/update',
    data
  })
}

/**
 * 删除 - 菜单后台路由关系
 * @param {*} data
 */
export function menuBackUrlDelete(data) {
  return service.request({
    method: 'post',
    url: 'privilege/menu/back/url/delete',
    data
  })
}
