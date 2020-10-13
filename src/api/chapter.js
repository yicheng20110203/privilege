import service from '@/utils/request'

/**
 * 章节管理 - 列表
 * @param {*} data
 */
export function getChapterList(data) {
  return service.request({
    method: 'post',
    url: 'lesson/admin/chapter/list',
    data
  })
}

/**
 * 章节管理 - 添加
 * @param {*} data
 */
export function chapterAdd(data) {
  return service.request({
    method: 'post',
    url: 'lesson/admin/chapter/add',
    data
  })
}

/**
 * 章节管理 - 修改
 * @param {*} data
 */
export function chapterUpdate(data) {
  return service.request({
    method: 'post',
    url: 'lesson/admin/chapter/update',
    data
  })
}

/**
 * 章节管理 - 删除
 * @param {*} data
 */
export function chapterDeleteLogic(data) {
  return service.request({
    method: 'post',
    url: 'lesson/admin/chapter/delete/logic',
    data
  })
}

/**
 * 章节管理 - 批量删除章节与内容关系
 * @param {*} data
 */
export function chapterSectionDelete(data) {
  return service.request({
    method: 'post',
    url: 'lesson/admin/chapter/section/delete',
    data
  })
}

/**
 * 章节管理 - 已关联内容 - 列表
 * @param {*} data
 */
export function chapterSectionSelected(data) {
  return service.request({
    method: 'post',
    url: 'lesson/admin/chapter/section/selected',
    data
  })
}

/**
 * 章节管理 - 可关联内容列表 - 分页
 * @param {*} data
 */
export function chapterSectionCanSelect(data) {
  return service.request({
    method: 'post',
    url: 'lesson/admin/chapter/section/can/select',
    data
  })
}

/**
 * 章节管理 - 设置章节内容 - 排序/可试看
 * @param {*} data
 */
export function chapterSetOrder(data) {
  return service.request({
    method: 'post',
    url: 'lesson/admin/chapter/set/order/try_reading',
    data
  })
}

/**
 * 章节管理 - 上架
 * @param {*} data
 */
export function chapterOnline(data) {
  return service.request({
    method: 'post',
    url: 'lesson/admin/chapter/online',
    data
  })
}

/**
 * 章节管理 - 下架
 * @param {*} data
 */
export function chapterOffline(data) {
  return service.request({
    method: 'post',
    url: 'lesson/admin/chapter/offline',
    data
  })
}
