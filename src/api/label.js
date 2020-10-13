import service from '@/utils/request'

/**
 * 标签 - 列表 - tree结构
 * @param {*} data
 */
export function getTagTree(data) {
  return service.request({
    method: 'post',
    url: 'lesson/admin/tag/list/tree',
    data
  })
}

/**
 * 标签 - 添加
 * @param {*} data
 */
export function tagAdd(data) {
  return service.request({
    method: 'post',
    url: 'lesson/admin/tag/add',
    data
  })
}

/**
 * 标签 - 修改
 * @param {*} data
 */
export function tagUpdate(data) {
  return service.request({
    method: 'post',
    url: 'lesson/admin/tag/update',
    data
  })
}

/**
 * 标签 - 删除
 * @param {*} data
 */
export function tagDelete(data) {
  return service.request({
    method: 'post',
    url: 'lesson/admin/tag/delete',
    data
  })
}

/**
 * 标签 - 列表 - 标签水平列表结构
 * @param {*} data
 */
export function getTagList(data) {
  return service.request({
    method: 'post',
    url: 'lesson/admin/tag/list',
    data
  })
}
