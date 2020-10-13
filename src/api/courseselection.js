import service from '@/utils/request'

/**
 * 课程管理 - 筛选项 - 汇总
 * @param {*} data
 */
export function getCourseFilters(data) {
  return service.request({
    method: 'post',
    url: 'lesson/admin/filters',
    data
  })
}

/**
 * 筛选项-用户
 * @param {*} data
 */
export function getUserFilters(data) {
  return service.request({
    method: 'post',
    url: 'user/admin/filter',
    data
  })
}
