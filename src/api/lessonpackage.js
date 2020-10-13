import service from '@/utils/request'

/**
 * 课包管理 - 列表
 * @param {*} data
 */
export function getLessonPackageList(data) {
  return service.request({
    method: 'post',
    url: 'lesson/admin/package/list',
    data
  })
}

/**
 * 课包管理 - 添加
 * @param {*} data
 */
export function lessonPackageAdd(data) {
  return service.request({
    method: 'post',
    url: 'lesson/admin/package/add',
    data
  })
}

/**
 * 课包管理 - 删除
 * @param {*} data
 */
export function lessonPackageDeleteLogic(data) {
  return service.request({
    method: 'post',
    url: 'lesson/admin/package/delete/logic',
    data
  })
}

/**
 * 课包管理 - 修改
 * @param {*} data
 */
export function lessonPackageUpdate(data) {
  return service.request({
    method: 'post',
    url: 'lesson/admin/package/update',
    data
  })
}

/**
 * 课包管理 - 已关联课程 - 列表
 * @param {*} data
 */
export function getLessonPackageSelected(data) {
  return service.request({
    method: 'post',
    url: 'lesson/admin/package/lesson/selected',
    data
  })
}

/**
 * 课包管理 - 可关联课程列表 - 分页
 * @param {*} data
 */
export function lessonPackageSelect(data) {
  return service.request({
    method: 'post',
    url: 'lesson/admin/package/lesson/can/select',
    data
  })
}

/**
 * 课包管理 - 设置课包内容 - 排序/可试看
 * @param {*} data
 */
export function lessonPackageSetOrder(data) {
  return service.request({
    method: 'post',
    url: 'lesson/admin/package/lesson/set/order',
    data
  })
}

/**
 * 课包管理 - 批量删除课包与课程关系
 * @param {*} data
 */
export function getLessonPackageDelete(data) {
  return service.request({
    method: 'post',
    url: 'lesson/admin/package/lesson/delete',
    data
  })
}

/**
 * 课包管理 - 上架
 * @param {*} data
 */
export function lessonPackageOnline(data) {
  return service.request({
    method: 'post',
    url: 'lesson/admin/package/online',
    data
  })
}

/**
 * 课包管理 - 下架
 * @param {*} data
 */
export function lessonPackageOffline(data) {
  return service.request({
    method: 'post',
    url: 'lesson/admin/package/offline',
    data
  })
}
