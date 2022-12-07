import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

import Msg from '../pages/Msg'
import Contacts from '../pages/Contacts'
import Menu from '../pages/Menu'

const routes = [
  {
    path: '/',
    redirect: '/msg',
  },
  {
    path: '/msg',
    component: Msg
  },
  {
    path: '/contacts',
    component: Contacts
  },
  {
    path: '/menu',
    component: Menu
  }
]

const createRouter = () => new Router({
  scrollBehavior: () => ({ y: 0 }),
  routes
})

const router = createRouter()

export default router
