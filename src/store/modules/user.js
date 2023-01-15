import { addUser, login, reqUserInfo } from '@/api'
import { setToken, removeToken } from "@/utils/token"

const state = {
  userInfo: {}
}

const mutations = {
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
  // 注册
  async register({commit}, data) {
    let res = await addUser(data)
    if (res.status == 200) {
      return 'ok'
    } else {
      return Promise.reject(new Error('注册失败'))
    }
  },

  // 登录
  async signIn({commit}, data) {
    let res = await login(data)
    if (res.status == 200) {
      setToken(res.msg)
      return 'ok'
    } else if (res.status == 201) {
      return Promise.reject(new Error(res.msg))
    } else {
      return Promise.reject(new Error('登录失败'))
    }
  },

  // 获取用户的信息
  async getUserInfo({ commit }) {
    let res = await reqUserInfo()
    if (res.status == 200) {
      commit('GET_USERINFO', res.msg)
      return 'ok'
    } else {
      return Promise.reject(new Error('falie'))
    }
  },

  // 退出登录
  async logout({ commit }) {
    // 后端没有处理登出接口
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
