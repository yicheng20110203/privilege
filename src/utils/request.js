import axios from 'axios'
import merge from 'lodash/merge'
import qs from 'qs'
import { MessageBox, Message } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'

const BASEURL = process.env.NODE_ENV !== 'production' && process.env.VUE_APP_OPEN_PROXY ? process.env.VUE_APP_BASE_API : process.env.VUE_APP_BASE_API
// create an axios instance
const service = axios.create({
  baseURL: BASEURL,
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 5000, // request timeout
  headers: {
    'Content-Type': 'application/json; charset=utf-8'
  }
})

/**
 * get请求参数处理
 * @param {*} params 参数对象
 * @param {*} openDefultParams 是否开启默认参数?
 */
service.adornParams = (params = {}, openDefultParams = true) => {
  const defaults = {}
  return openDefultParams ? merge(defaults, params) : params
}

/**
 * post请求数据处理
 * @param {*} data 数据对象
 * @param {*} contentType 数据格式
 *  json: 'application/json; charset=utf-8'
 *  form: 'application/x-www-form-urlencoded; charset=utf-8'
 */
service.adornData = (data = {}, openDefultdata = true, contentType = 'json') => {
  var defaults = {}
  data = openDefultdata ? merge(defaults, data) : data
  return contentType === 'json' ? JSON.stringify(data) : qs.stringify(data)
}

/**
 * 请求接口前，做一些数据处理(请求拦截器)
 */
service.interceptors.request.use(
  config => {
    if (store.getters.token) {
      config.headers['Authorization'] = getToken()
      // config.headers['X-User-Id'] = getUserId()
      // config.headers['X-Os'] = getOs()
    }

    return config
  },
  error => {
    // 请求错误处理
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

/**
 * 请求接口后，返回数据进行拦截(响应拦截器)
 */
service.interceptors.response.use(
  response => {
    console.log('response接口返回数据', response.data)
    const res = response.data
    if (res.code === 0) {
      return res
    } else if (res.code === 51001) { // 51001 账号密码错误
      Message({
        message: res.msg || 'Error',
        type: 'error',
        duration: 5 * 1000
      })
    } else if (res.code === 51002) { // 51002 管理员账号不存在
      Message({
        message: res.msg || 'Error',
        type: 'error',
        duration: 5 * 1000
      })
    } else if (res.code === 51003) { // 51003 token验证错误
      MessageBox.confirm('您已注销，可以取消以保留在该页面上，或者再次登录', '确认登出', {
        confirmButtonText: '重新登录',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        store.dispatch('user/resetToken').then(() => {
          location.reload()
        })
      })
    } else {
      Message({
        message: res.msg || 'Error',
        type: 'error',
        duration: 5 * 1000
      })
    }
  },
  error => {
    console.log('err' + error) // for debug
    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
