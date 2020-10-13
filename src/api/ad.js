import service from '@/utils/request'

/**
 * 广告 - 列表
 * @param {*} data
 */
export function getAdList(data) {
  service.request({
    method: 'post',
    url: 'lesson/admin/ad/list',
    data
  })
}

/**
 * 广告 - 添加
 * @param {*} data
 */
export function adAdd(data) {
  service.request({
    method: 'post',
    url: 'lesson/admin/ad/add',
    data
  })
}

/**
 * 广告 - 修改
 * @param {*} data
 */
export function adUpdate(data) {
  service.request({
    method: 'post',
    url: 'lesson/admin/ad/update',
    data
  })
}

/**
 * 广告 - 删除
 * @param {*} data
 */
export function adDelete(data) {
  service.request({
    method: 'post',
    url: 'lesson/admin/ad/delete',
    data
  })
}
