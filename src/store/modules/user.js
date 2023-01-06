import { addUser, login, reqUserInfo } from '@/api'
import { setToken, getToken, removeToken } from "@/utils/token"

const getDefaultState = () => {
  return {
    token: getToken(),
    userInfo: {}
  }
}

const state = getDefaultState()

const mutations = {
  SIGNIN(state, data) {
    state.token = data.token
  },
  GET_USERINFO(state, data) {
    state.userInfo = data
  },
  LOGOUT(state) {
    state.token = ''
    state.userInfo = {}
    removeToken()
  }
}

const actions = {
  async register({commit}, data) {
    let res = await addUser(data)
    if (res.status == 0) {
      return 'ok'
    } else {
      return Promise.reject(new Error('falie'))
    }
  },
  async signIn({commit}, data) {
    let res = await login(data)
    if (res.status == 0) {
      commit('SIGNIN', res.msg)
      setToken(res.msg.token)
      return 'ok'
    } else if (res.status == 2) {
      return Promise.reject(new Error(res.msg))
    } else {
      return Promise.reject(new Error('falie'))
    }
  },
  async getUserInfo({ commit }) {
    let res = await reqUserInfo()
    if (res.status == 0) {
      commit('GET_USERINFO', res.msg)
      return 'ok'
    } else {
      return Promise.reject(new Error('falie'))
    }
  },
  async logout({ commit }) {
    //let res = await logout()
    let res = { status: 0 }
    if (res.status == 0) {
        commit('LOGOUT')
        return 'ok'
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
