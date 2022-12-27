import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

import Msg from '../pages/Msg'
import Contacts from '../pages/Contacts'
import More from '../pages/More'
import Dialog from '../pages/Dialog'
import Search from '../pages/Search'
import Login from '../pages/Login'
import Register from '../pages/Register'

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
    path: '/more',
    component: More
  },
  {
    path: '/dialog',
    component: Dialog
  },
  {
    path: '/search',
    component: Search
  },
  {
    path: '/login',
    component: Login
  },
  {
    path: '/register',
    component: Register
  }
]

const createRouter = () => new Router({
  scrollBehavior: () => ({ y: 0 }),
  routes
})

const router = createRouter()

export default router
