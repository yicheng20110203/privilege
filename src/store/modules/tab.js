/**
 * tab 切换
 */

const state = {
  material_active_name: 'video'
}

const mutations = {
  SET_ACTIVE(state, name) {
    state.material_active_name = name
  }
}

const actions = {
  material_active({ commit }, activename) {
    commit('SET_ACTIVE', activename)
  }
}
export default {
  namespaced: true,
  state,
  mutations,
  actions
}
