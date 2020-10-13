import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'
import app from './modules/app'
import settings from './modules/settings'
import user from './modules/user'
import menu from './modules/menu'
import tab from './modules/tab'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    app,
    settings,
    menu,
    user,
    tab
  },
  getters
})

export default store
