import Vue from 'vue'
import Vuex from 'vuex'

import User from './modules/user'
import Search from './modules/search'
import Friend from './modules/friend'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    User,
    Search,
    Friend
  },
})

export default store
