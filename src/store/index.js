import Vue from "vue";
import Vuex from "vuex";

import User from "./modules/user";
import Search from "./modules/search";
import Friend from "./modules/friend";
import Chat from "./modules/chat";

Vue.use(Vuex);

const store = new Vuex.Store({
  modules: {
    User,
    Search,
    Friend,
    Chat,
  },
});

export default store;
