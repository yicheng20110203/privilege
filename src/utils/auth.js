import Cookies from 'js-cookie'
/**
 *  存储X-Token
 *  存储X-User-Id
 *  存储X-Os
 */
const TokenKey = 'ceibsdigital_token'
const UserIdKey = 'id'
const OsKey = 'h5'
const LoginNamekey = 'login_name'
const ImgToken = 'photo'
/**
 * 存储菜单列表和权限
 */
const menuList = 'menus'
const permissions = 'permissions'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}

export function getUserId() {
  return Cookies.get(UserIdKey)
}

export function setUserId(value) {
  return Cookies.set(UserIdKey, value)
}

export function removeUserId() {
  return Cookies.remove(UserIdKey)
}

export function getOs() {
  return Cookies.get(OsKey)
}

export function setOs(value) {
  return Cookies.set(OsKey, value)
}

export function removeOs() {
  return Cookies.remove(OsKey)
}

export function getLoginName() {
  return Cookies.get(LoginNamekey)
}

export function setLoginName(value) {
  return Cookies.set(LoginNamekey, value)
}

export function removeLoginName() {
  return Cookies.remove(LoginNamekey)
}

export function setMenuList(value) {
  return localStorage.setItem(menuList, JSON.stringify(value || '[]'))
}

export function getMenuList() {
  return localStorage.getItem(menuList)
}

export function removeMenuList() {
  return localStorage.removeItem(menuList)
}

export function setPermissions(value) {
  return localStorage.setItem(permissions, value)
}

export function getPermissions() {
  return localStorage.getItem(permissions)
}

export function removePermissions() {
  return localStorage.removeItem(permissions)
}

export function setImgToken(value) {
  return Cookies.set(ImgToken, value)
}

export function getImgToken() {
  return Cookies.get(ImgToken)
}

export function removeImgToken() {
  return Cookies.remove(ImgToken)
}
