import { reqAllMsgs } from '@/api'

const state = {
    allMsgs: []
}

const mutations = {
    REQ_ALLMSGS(state, data) {
        state.allMsgs = data
    }
}

const actions = {
    // 获取所有消息
    async reqAllMsgs({commit})  {
        let res = await reqAllMsgs()
        if (res.status == 200) {
            commit('REQ_ALLMSGS', res.msg)
            return 'ok'
        } else {
            return Promise.reject(new Error('获取聊天记录失败'))
        }
    }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
