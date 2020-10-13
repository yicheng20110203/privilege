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
