import service from '@/utils/request'

/**
 * 用户登陆
 * @param {*} data
 */
export function Login(data) {
  return service.request({
    method: 'post',
    url: 'privilege/user/login',
    data
  })
}
