import service from '@/utils/request'

/**
 * 分类列表 - tree结构
 * @param {*} data
 */
export function getCategoryListTree(data) {
  return service.request({
    method: 'post',
    url: 'lesson/admin/category/list/tree',
    data
  })
}

/**
 * 分类列表 - 添加 - 分类
 * @param {*} data
 */
export function categoryAddTree(data) {
  return service.request({
    method: 'post',
    url: 'lesson/admin/category/add',
    data
  })
}

/**
 * 分类列表 - 修改 - 分类
 * @param {*} data
 */
export function categoryUpdateTree(data) {
  return service.request({
    method: 'post',
    url: 'lesson/admin/category/update',
    data
  })
}

/**
 * 分类列表 - 删除 - 分类
 * @param {*} data
 */
export function categoryDeleteTree(data) {
  return service.request({
    method: 'post',
    url: 'lesson/admin/category/delete',
    data
  })
}
