import { logout, getInfo } from '@/api/user'
import { Login } from '@/api/login'
import { getToken, setToken, removeToken, getUserId, setUserId, removeUserId, setOs, getOs, removeOs, getLoginName, setLoginName, removeLoginName, getMenuList, setMenuList, removeMenuList } from '@/utils/auth'
import { resetRouter } from '@/router'

const getDefaultState = () => {
  return {
    token: getToken(),
    login_name: getLoginName(),
    username: getLoginName(),
    authorization: '',
    name: '',
    avatar: '',
    isLogin: false,
    userid: getUserId(),
    os: getOs(),
    menulist: getMenuList()
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_USERID: (state, userid) => {
    state.userid = userid
  },
  SET_LOGINNAME: (state, login_name) => {
    state.login_name = login_name
  },
  SET_USERNAME: (state, username) => {
    state.username = username
  },
  SET_OS: (state, os) => {
    state.os = os
  },
  SET_ISLOGIN: (state, islogin) => {
    state.isLogin = islogin
  },
  SET_MENULIST: (state, menulist) => {
    state.menulist = menulist
  }

}

const actions = {
  // 用户登录
  login({ commit }, data) {
    return new Promise((resolve, reject) => {
      Login(data).then(response => {
        const userdata = response.data
        commit('SET_TOKEN', userdata.authorization)
        commit('SET_USERID', userdata.id)
        commit('SET_OS', userdata.os)
        commit('SET_LOGINNAME', userdata.user_info.login_name)
        commit('SET_MENULIST', userdata.menus)
        commit('SET_ISLOGIN', true)
        setToken(userdata.authorization)
        setUserId(userdata.id)
        setOs(userdata.os)
        setLoginName(userdata.user_info.login_name)
        setMenuList(userdata.menus)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // 获取用户信息
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo().then(response => {
        const userData = response.data
        if (!userData) {
          reject('验证失败，请重新登录。')
        }
        commit('SET_MENULIST', userData.menus)
        setMenuList(userData.menus)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // 注销
  logout({ commit }) {
    return new Promise((resolve, reject) => {
      logout().then(() => {
        removeToken() // must remove  token  first
        removeUserId()
        removeOs()
        removeLoginName()
        resetRouter()
        removeMenuList()
        commit('RESET_STATE')
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // 重置token,userid,os,login_name
  resetToken({ commit }) {
    return new Promise(resolve => {
      removeToken() // must remove  token  first
      removeUserId()
      removeOs()
      removeLoginName()
      removeMenuList()
      commit('RESET_STATE')
      resolve()
    })
  },

  // 重置userid
  resetUserId({ commit }) {
    return new Promise(resolve => {
      removeUserId()
      resolve()
    })
  },

  // 重置 login_name
  restLoginName({ commit }) {
    return new Promise(resolve => {
      removeLoginName()
      resolve()
    })
  },

  // 重置OS
  resetOs({ commit }) {
    return new Promise(resolve => {
      removeOs()
      resolve()
    })
  }

}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

