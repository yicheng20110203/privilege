import Vue from 'vue'
import SvgIcon from '@/components/SvgIcon'// svg component

// register globally
Vue.component('svg-icon', SvgIcon)

const req = require.context('./svg', false, /\.svg$/)
const requireAll = requireContext => requireContext.keys().map(requireContext)
requireAll(req)

export default {
  // 获取图标*.svg名称列表
  getNameList() {
    return requireAll(req).map(item => item.default.id.replace('icon-', ''))
  }
}

