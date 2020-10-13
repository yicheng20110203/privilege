/**
 * 后台菜单路由
 */
import { constantRoutes } from '@/router'
import { getMenuList } from '@/utils/auth'
const _import = require('../../router/_import_' + process.env.NODE_ENV) // 获取组件的方法
/* Layout */
import Layout from '@/layout'

function generaMenu(menusData, data) {
  data.forEach((item) => {
    const menu = {
      path: item.path,
      component: item.component === 'Layout' ? Layout : _import(item.component),
      redirect: item.redirect,
      name: item.name,
      meta: { title: item.title, icon: item.icon },
      children: []
    }
    if (item.children && item.children.length > 0) {
      generaMenu(menu.children, item.children)
    }
    menusData.push(menu)
  })
}
const state = {
  allRouters: [],
  addRouters: []
}

const mutations = {
  SET_ROUTER(state, router) {
    state.allRouters = constantRoutes.concat(router) // 所有的
    state.addRouters = router // 动态路由的
  }
}

const actions = {
  // 获取动态路由
  getMenu({ commit }) {
    return new Promise((resolve, reject) => {
      const menusData = []
      // 获取最新菜单
      const menus = JSON.parse(getMenuList())
      // 递归菜单
      generaMenu(menusData, menus)
      // 更新路由
      console.log('递归后菜单', menusData)
      commit('SET_ROUTER', menusData)
      resolve(menusData)
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
