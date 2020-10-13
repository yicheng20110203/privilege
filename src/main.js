import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/lib/locale/lang/zh-CN' // lang i18n
import httpRequest from '@/utils/request' // 接口请求
import * as custom from '@/utils/customFilter'

import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'

import '@/icons' // icon
import '@/router/permission' // permission control

// set ElementUI lang to EN
Vue.use(ElementUI, { locale })
// 如果想要中文版 element-ui，按如下方式声明
// Vue.use(ElementUI)

// 挂载全局
Vue.prototype.$service = httpRequest // ajax请求方法
Vue.config.productionTip = false

// 注册自定义过滤器，下列代码是引用所有的自定义过滤器
Object.keys(custom).forEach(key => {
  Vue.filter(key, custom[key])
})

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
