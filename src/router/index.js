import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      component: () => import('@/components/Home')
    },
    {
      path: '/index',
      component: () => import('@/components/Home')
    },
    {
      path: '/application',
      component: () => import('@/components/Application')
    },
    {
      path: '/config',
      component: () => import('@/components/Config')
    },
    {
      path: '/login',
      component: () => import('@/components/Login')
    },
    {
      path: '/login',
      component: () => import('@/components/Login')
    }
  ]
})
