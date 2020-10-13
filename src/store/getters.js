const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  authorization: state => state.user.authorization,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  material_active_name: state => state.tab.material_active_name,
  userid: state => state.user.userid,
  os: state => state.user.os,
  login_name: state => state.user.login_name,
  username: state => state.user.username,
  isLogin: state => state.user.isLogin,
  allRouters: state => state.menu.allRouters,
  addRouters: state => state.menu.addRouters,
  menulist: state => state.user.menulist

}
export default getters
