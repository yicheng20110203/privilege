import service from '@/utils/request'

/**
 * 内容 - 列表
 * @param {*} data
 */
export function getContentList(data) {
  return service.request({
    method: 'post',
    url: 'lesson/admin/section/list',
    data
  })
}

/**
 * 内容 - 添加
 * @param {*} data
 */
export function contentAdd(data) {
  return service.request({
    method: 'post',
    url: 'lesson/admin/section/add',
    data
  })
}

/**
 * 内容 - 修改
 * @param {*} data
 */
export function contentUpdate(data) {
  return service.request({
    method: 'post',
    url: 'lesson/admin/section/update',
    data
  })
}

/**
 * 内容 - 批量删除
 * @param {*} data
 */
export function contentDelete(data) {
  return service.request({
    method: 'post',
    url: 'lesson/admin/section/delete',
    data
  })
}

/**
 * 内容 - 上架
 * @param {*} data
 */
export function contentOnline(data) {
  return service.request({
    method: 'post',
    url: 'lesson/admin/section/online',
    data
  })
}

/**
 * 内容 - 下架
 * @param {*} data
 */
export function contentOffline(data) {
  return service.request({
    method: 'post',
    url: 'lesson/admin/section/offline',
    data
  })
}
