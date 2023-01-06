import Vue from 'vue'
import Vuex from 'vuex'

import User from './modules/user'
import Search from './modules/search'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    User,
    Search
  },
})

export default store
