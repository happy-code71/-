import { login } from '@/api/user'
import { getToken, setToken } from '@/utils/auth'

const state = {
  token: getToken() || ''
}
const mutations = {
  SET_TOKEN(state, token) {
    state.token = token
  }
}
const actions = {
  async login({ commit }, body) {
    const token = await login(body)
    commit('SET_TOKEN', token)
    setToken(token)
  }
}
export default {
  namespaced: true,
  state,
  mutations,
  actions
}

