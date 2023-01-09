import { reqAllFriendMsgs, reqAllMyMsgs } from '@/api'

const state = {
    friendAllMsgs: [],
    myAllMsgs: []
}

const mutations = {
    FRIEND_MSGS(state, data) {
        state.friendAllMsgs = data
    },
    MY_MSGS(state, data) {
        state.myAllMsgs = data
    },
}

const actions = {
    // 获取所有消息
    async reqAllMsgs({dispatch}) {
        let res1 = await dispatch('reqAllFriendMsgs')
        let res2 = await dispatch('reqAllMyMsgs')
        return Promise.all([res1, res2])
    },
    // 获取所有好友发送的消息
    async reqAllFriendMsgs({commit}) {
        let res = await reqAllFriendMsgs()
        if (res.status == 0) {
            commit('FRIEND_MSGS', res.msg)
            return 'ok'
        } else {
            return Promise.reject(new Error('falie'))
        }
    },
    // 获取所有好友发送的消息
    async reqAllMyMsgs({commit}) {
        let res = await reqAllMyMsgs()
        if (res.status == 0) {
            commit('MY_MSGS', res.msg)
            return 'ok'
        } else {
            return Promise.reject(new Error('falie'))
        }
    },
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
