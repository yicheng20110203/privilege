import service from '@/utils/request'

/**
 * 课程 - 列表
 * @param {*} data
 */
export function getCourseList(data) {
  return service.request({
    method: 'post',
    url: 'lesson/admin/lesson/list',
    data
  })
}

/**
 * 课程管理 - 添加
 * @param {y} data
 */
export function courseManagementAdd(data) {
  return service.request({
    method: 'post',
    url: 'lesson/admin/lesson/add',
    data
  })
}

/**
 * 课程管理 - 修改
 * @param {*} data
 */
export function courseManagementUpdate(data) {
  return service.request({
    method: 'post',
    url: 'lesson/admin/lesson/update',
    data
  })
}

/**
 * 课程管理 - 删除
 * @param {*} data
 */
export function courseManagementDeleteLogic(data) {
  return service.request({
    method: 'post',
    url: 'lesson/admin/lesson/delete/logic',
    data
  })
}

/**
 * 课程管理 - 已关联章节 - 列表
 * @param {*} data
 */
export function courseChapterSelected(data) {
  return service.request({
    method: 'post',
    url: 'lesson/admin/lesson/chapter/selected',
    data
  })
}

/**
 * 课程管理 - 可关联章节列表 - 分页
 * @param {*} data
 */
export function courseChapterCanSelect(data) {
  return service.request({
    method: 'post',
    url: 'lesson/admin/lesson/chapter/can/select',
    data
  })
}

/**
 * 课程管理 - 设置章节内容 - 排序/可试看
 * @param {*} data
 */
export function courseChapterSetOrder(data) {
  return service.request({
    method: 'post',
    url: 'lesson/admin/lesson/chapter/set/order',
    data
  })
}

/**
 * 课程管理 - 批量删除课与章节关系
 * @param {*} data
 */
export function courseChapterDelete(data) {
  return service.request({
    method: 'post',
    url: 'lesson/admin/lesson/chapter/delete',
    data
  })
}

/**
 * 课程管理 - 上架
 * @param {*} data
 */
export function courseOnline(data) {
  return service.request({
    method: 'post',
    url: 'lesson/admin/lesson/online',
    data
  })
}

/**
 * 课程管理 - 下架
 * @param {*} data
 */
export function courseOffline(data) {
  return service.request({
    method: 'post',
    url: 'lesson/admin/lesson/offline',
    data
  })
}
