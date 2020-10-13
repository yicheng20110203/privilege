import service from '@/utils/request'

/**
 * token生成
 * @param {*} data
 */
export function ossUpload(data) {
  return service.request({
    method: 'post',
    url: 'lesson/admin/oss/upload/access/encrypt',
    data
  })
}
