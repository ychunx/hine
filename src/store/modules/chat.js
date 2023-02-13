import { reqAllMsgs, reqAllEncryptedMsgs, reqAllGroupMsgs } from "@/api";

const state = {
  allMsgs: [],
  allEncryptedMsgs: [],
  allGroupMsgs: [],
};

const mutations = {
  REQ_ALLMSGS(state, data) {
    state.allMsgs = data;
  },
  REQ_ALLENCRYPTEDMSGS(state, data) {
    state.allEncryptedMsgs = data;
  },
  REQ_ALLGROUPMSGS(state, data) {
    state.allGroupMsgs = data;
  },
};

const actions = {
  // 获取所有非加密消息
  async reqAllMsgs({ commit }) {
    let res = await reqAllMsgs();
    if (res.status == 200) {
      commit("REQ_ALLMSGS", res.msg);
      return "ok";
    } else {
      return Promise.reject(new Error("获取聊天记录失败"));
    }
  },
  // 获取所有加密消息
  async reqAllEncryptedMsgs({ commit }) {
    let res = await reqAllEncryptedMsgs();
    if (res.status == 200) {
      commit("REQ_ALLENCRYPTEDMSGS", res.msg);
      return "ok";
    } else {
      return Promise.reject(new Error("获取聊天记录失败"));
    }
  },
  // 获取所有群组消息和信息
  async reqAllGroupMsgs({ commit }) {
    let res = await reqAllGroupMsgs();
    if (res.status == 200) {
      commit("REQ_ALLGROUPMSGS", res.msg);
      return "ok";
    } else {
      return Promise.reject(new Error("获取群组聊天记录失败"));
    }
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
