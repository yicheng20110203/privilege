import service from '@/utils/request'

/**
 * 素材管理 - 列表
 * @param {*} data
 */
export function getMaterialList(data) {
  return service.request({
    method: 'post',
    url: 'lesson/admin/material/list',
    data
  })
}

/**
 * 素材管理 - 添加
 * @param {*} data
 */
export function materialAdd(data) {
  return service.request({
    method: 'post',
    url: 'lesson/admin/material/add',
    data
  })
}

/**
 * 素材管理 - 更新
 * @param {*} data
 */
export function materialUpdate(data) {
  return service.request({
    method: 'post',
    url: 'lesson/admin/material/update',
    data
  })
}

/**
 * 素材管理 - 删除
 * @param {*} data
 */
export function materialDelete(data) {
  return service.request({
    method: 'post',
    url: 'lesson/admin/material/delete',
    data
  })
}
