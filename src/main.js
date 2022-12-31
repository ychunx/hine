import Vue from 'vue'
import App from './App.vue'

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
  }
}).$mount('#app')
