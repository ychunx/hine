import Vue from "vue";
import App from "./App.vue";
import io from "./utils/weapp.socket.io";

Vue.config.productionTip = false;

import router from "./router";
import * as API from "./api";
import store from "./store";

// 页面加载后元素自动获取到焦点
Vue.directive("focus", {
  inserted(e) {
    e.focus();
  },
});

new Vue({
  render: (h) => h(App),
  router,
  store,
  beforeCreate() {
    Vue.prototype.$bus = this;
    Vue.prototype.$API = API;
    Vue.prototype.$socket = io("http://localhost:3001");
  },
}).$mount("#app");
