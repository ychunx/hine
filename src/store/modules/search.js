import { searchUser, searchGroup, relation, isInGroup } from "@/api";

const state = {
  searchUsers: [],
  relations: [],
  searchGroups: [],
  isInGroups: [],
  key: "",
};

const mutations = {
  SEARCH_USER(state, data) {
    state.searchUsers = data;
  },
  QUERY_FRIEND_RELATION(state, data) {
    state.relations = data;
  },
  SEARCH_GROUP(state, data) {
    state.searchGroups = data;
  },
  QUERY_IS_IN_GROUP(state, data) {
    state.isInGroups = data;
  },
  SAVE_KEY(state, key) {
    state.key = key;
  },
  CLEAR_RESULT(state) {
    state.searchUsers = [];
    state.searchGroups = [];
    state.relations = [];
    state.isInGroups = [];
    state.key = "";
  },
};

const actions = {
  // 整合搜索为一个方法
  search({ dispatch, commit, state }, data) {
    commit("SAVE_KEY", data.key);

    let user = dispatch("searchUser", data).then(
      (value) => {
        return dispatch("queryFriendRelation", state.searchUsers);
      },
      (reason) => {
        return Promise.reject(new Error(reason));
      }
    );

    let group = dispatch("searchGroup", data).then(
      (value) => {
        return dispatch("queryIsInGroup", state.searchGroups);
      },
      (reason) => {
        return Promise.reject(new Error(reason));
      }
    );

    return Promise.all([user, group]);
  },
  // 搜索用户
  async searchUser({ commit }, data) {
    let res = await searchUser(data);
    if (res.status == 200) {
      commit("SEARCH_USER", res.msg);
      return "ok";
    } else {
      return Promise.reject(new Error("搜索用户失败"));
    }
  },
  // 查询所展示的对方用户与用户的关系
  async queryFriendRelation({ commit, rootState }, data) {
    let userId = rootState.User.userInfo._id;
    let allRes = await Promise.all(
      data.map(async (item) => {
        let friendId = item._id;
        let res = await relation({ userId, friendId });
        if (res.status != 500) {
          return {
            friendId,
            relation: res.status, // 0是好友、2申请中、3非好友、1错误
          };
        } else {
          return Promise.reject(new Error("查询好友关系失败"));
        }
      })
    );
    commit("QUERY_FRIEND_RELATION", allRes);
    return allRes;
  },
  // 搜索群组
  async searchGroup({ commit }, data) {
    let res = await searchGroup(data);
    if (res.status == 200) {
      commit("SEARCH_GROUP", res.msg);
      return "ok";
    } else {
      return Promise.reject(new Error("搜索群组失败"));
    }
  },
  // 查询用户和所展示的群组的关系
  async queryIsInGroup({ commit, rootState }, data) {
    let userId = rootState.User.userInfo._id;
    let allRes = await Promise.all(
      data.map(async (item) => {
        let groupId = item._id;
        let res = await isInGroup({ userId, groupId });
        if (res.status != 500) {
          return {
            groupId,
            relation: res.status, // 0在群内、2非群成员、1错误
          };
        } else {
          return Promise.reject(new Error("查询关系失败"));
        }
      })
    );
    commit("QUERY_IS_IN_GROUP", allRes);
    return allRes;
  },
  // 清空搜索数据
  clearResult({ commit }) {
    commit("CLEAR_RESULT");
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
