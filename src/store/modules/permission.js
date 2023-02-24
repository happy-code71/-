import { constantRoutes, asyncRoutes } from '@/router'

const state = {
  routes: []
}
const mutations = {
  setRoutes(state, newRoutes) {
    // 静态路由和用户身上路由合并形成完整的路由
    state.routes = [...constantRoutes, ...newRoutes]
  }
}
const actions = {
  // menus: 路由权限的标识
  // 用户身上的路由标识和动态路由进行比对
  filterRoute({ commit }, menus) {
    const routeArr = []
    menus.forEach(item => {
      const arr = asyncRoutes.filter(key => key.name === item)
      routeArr.push(...arr)
    })
    commit('setRoutes', routeArr)
    return routeArr
  }
}
export default {
  namespaced: true,
  state,
  mutations,
  actions
}
