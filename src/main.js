import Vue from 'vue'
import App from './App.vue'
import io from './utils/weapp.socket.io'

Vue.config.productionTip = false

import router from './router'
import * as API from './api'
import store from './store'

new Vue({
  render: h => h(App),
  router,
  store,
  beforeCreate() {
    Vue.prototype.$bus = this
    Vue.prototype.$API = API
    Vue.prototype.$socket = io('http://localhost:3001')
    //Vue.prototype.$socket = io('http://43.138.238.142:3001')
  }
}).$mount('#app')
