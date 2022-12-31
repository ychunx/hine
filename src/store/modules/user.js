import {adduser} from '@/api'

const getDefaultState = () => {
  return {
    token: 'this is token',
  }
}

const state = getDefaultState()

const mutations = {

}

const actions = {
  async register({commit}, data) {
    let res = await adduser(data)
    if (res.status == 0) {
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
