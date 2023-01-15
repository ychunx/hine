import Vue from 'vue'
import Router from 'vue-router'
import routes from './routes'
import store from "@/store"
import { getToken } from "@/utils/token"

Vue.use(Router)

let router = new Router({
  scrollBehavior: () => ({ y: 0 }),
  routes
})

router.beforeEach(async (to, from, next) => {
    // 从vuex获取token
    let token = getToken()
    // 从vuex获取用户名（登录后才有）
    let name = store.state.User.userInfo.name

    if (token) {
        // 已登录
        // 已登录则不许进入注册和登录页面
        if (to.path == '/login' || to.path == '/register') {
          next('/')
        } else {
          if (name) {
            next()
          } else {
            // 如果获取不到用户名则让用户重新登录
            try {
              await store.dispatch('User/getUserInfo')
              if (store.state.User.userInfo.name) {
                next()
              }
            } catch (error) {
              await store.dispatch('User/logout')
              next('/login')
            }
          }
        }
    } else {
        // 未登录
        let toPath = to.path
        // 如果不是在登录页或注册页，会跳转登录页
        if (toPath.indexOf('/login') == -1 && toPath.indexOf('/register') == -1) {
          // 登录后直接跳转到登录前想前往的路由
          next(`/login?redirect=${toPath}`)
        } else {
          // 其余放行
          next()
        }
    }
})

export default router
