export default [
  {
    path: '/',
    redirect: '/msg',
  },
  {
    path: '/msg',
    component: () => import('../pages/Msg')
  },
  {
    path: '/contacts',
    component: () => import('../pages/Contacts')
  },
  {
    path: '/more',
    component: () => import('../pages/More')
  },
  {
    path: '/dialog',
    component: () => import('../pages/Dialog')
  },
  {
    path: '/search',
    component: () => import('../pages/Search')
  },
  {
    path: '/login',
    component: () => import('../pages/Login')
  },
  {
    path: '/register',
    component: () => import('../pages/Register')
  }
]