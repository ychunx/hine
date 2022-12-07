import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

import Msg from '../pages/Msg'
import Contacts from '../pages/Contacts'
import More from '../pages/More'

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
  }
]

const createRouter = () => new Router({
  scrollBehavior: () => ({ y: 0 }),
  routes
})

const router = createRouter()

export default router
