import router from '.'
import store from '../store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { getToken } from '@/utils/auth' // get token from cookie
import getPageTitle from '@/utils/get-page-title'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['/login'] // no redirect whitelist

router.beforeEach(async(to, from, next) => {
  // start progress bar
  NProgress.start()

  // 设置页面title
  document.title = getPageTitle(to.meta.title)

  if (getToken()) {
    if (to.path === '/login') {
      // 如果已登录，则重定向到主页
      next({ path: '/' })
      NProgress.done()
    } else {
      // console.log('to-path', to.path)
      try {
        // const accessRoutes = await store.dispatch('menu/getMenu')
        // router.$addRoutes(accessRoutes)
        // next({ ...to, replace: true })
        next()
      } catch (error) {
        // remove token and go to login page to re-login
        await store.dispatch('user/resetToken')
        Message.error(error || 'Has Error')
        next(`/login?redirect=${to.path}`)
        // next()
        NProgress.done()
      }
    }
  } else {
    if (whiteList.indexOf(to.path) !== -1) {
      // 存在
      next()
    } else {
      // 路由指向
      next(`/login?redirect=${to.path}`)
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})
