import { adduser, login } from '@/api'
import { setToken, getToken, removeToken } from "@/utils/token"

const getDefaultState = () => {
  return {
    token: getToken(),
  }
}

const state = getDefaultState()

const mutations = {
  SIGNIN(state, token) {
    state.token = token
  }
}

const actions = {
  async register({commit}, data) {
    let res = await adduser(data)
    if (res.status == 0) {
      return 'ok'
    } else {
      return Promise.reject(new Error('falie'))
    }
  },
  async signIn({commit}, data) {
    let res = await login(data)
    if (res.status == 0) {
      commit('SIGNIN', res.msg.token)
      setToken(res.msg.token)
      return 'ok'
    } else if (res.status == 2) {
      return Promise.reject(new Error(res.msg))
    } else {
      return Promise.reject(new Error('falie'))
    }
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
