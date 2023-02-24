import { getUserBaseInfo, getUserInfo, login } from '@/api/user'
import { getToken, removeTimeStamp, removeToken, setTimeStamp, setToken } from '@/utils/auth'
import { resetRouter } from '@/router'

const state = {
  token: getToken() || '',
  userInfo: {}
}
const mutations = {
  SET_TOKEN(state, token) {
    state.token = token
  },
  SET_USERINFO(state, data) {
    state.userInfo = data
  },
  REMOVE_USER(state) {
    state.token = ''
    state.userInfo = {}
    removeToken()
    //   删除时间戳
    removeTimeStamp()
  }
}
const actions = {
  // 登录
  async login({ commit }, body) {
    const token = await login(body)
    commit('SET_TOKEN', token)
    setToken(token)
    // 设置时间戳
    setTimeStamp()
  },
  // 获取用户信息
  async getUserInfo({ commit }) {
    const res = await getUserInfo()
    const baseInfo = await getUserBaseInfo(res.userId)
    commit('SET_USERINFO', { ...res, ...baseInfo })
    return res // 获取身上的权限
  },
  // 退出登录
  logOut({ commit }) {
    commit('REMOVE_USER')
    //   重置路由
    resetRouter()
    //   清空当前路由表
    // { root: true } : 访问全局对象
    commit('permission/setRoutes', [], { root: true })
  }
}
export default {
  namespaced: true,
  state,
  mutations,
  actions
}

