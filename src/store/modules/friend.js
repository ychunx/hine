import { reqFriends, getFriendApplys } from '@/api'

const state = {
    friends: [],
    friendApplys: []
}

const mutations = {
    REQ_FRIENDS(state, data) {
        state.friends = data
    },
    REQ_FRIEND_APPLYS(state, data) {
        state.friendApplys = data
    }
}

const actions = {
    // 获取好友列表
    async reqFriends({commit}) {
        let res = await reqFriends()
        if (res.status == 0) {
            commit('REQ_FRIENDS', res.msg)
            return 'ok'
        } else {
            return Promise.reject(new Error('falie'))
        }
    },
    // 获取好友申请列表
    async reqFriendApplys({commit}) {
        let res = await getFriendApplys()
        if (res.status == 0) {
            commit('REQ_FRIEND_APPLYS', res.msg)
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
