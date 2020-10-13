import service from '@/utils/request'

/**
 * 页面 - 列表
 * @param {*} data
 */
export function getPageList(data) {
  return service.request({
    method: 'post',
    url: 'lesson/admin/page/list',
    data
  })
}

/**
 * 页面 - 添加
 * @param {*} data
 */
export function pageAdd(data) {
  return service.request({
    method: 'post',
    url: 'lesson/admin/page/add',
    data
  })
}

/**
 * 页面 - 修改
 * @param {*} data
 */
export function pageUpdate(data) {
  return service.request({
    method: 'post',
    url: 'lesson/admin/page/update',
    data
  })
}

/**
 * 页面 - 删除
 * @param {*} data
 */
export function pageDelete(data) {
  return service.request({
    method: 'post',
    url: 'lesson/admin/page/delete',
    data
  })
}
