import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/',
      component: () => import('@/components/Index'),
      redirect: '/home',
      children: [
        {
          path: '/home',
          component: () => import('@/components/Home')
        },
        {
          path: '/addOrg',
          component: () => import('@/components/AddOrg')
        },
        {
          path: '/orgs',
          component: () => import('@/components/OrganizationList')
        },
        {
          path: '/config',
          component: () => import('@/components/Config')
        }
      ]
    },
    {
      path: '/application',
      component: () => import('@/components/Application')
    },
    {
      path: '/login',
      component: () => import('@/components/Login')
    }
  ]
})

router.beforeEach((to, from, next) => {
//  to 将要访问的路径
//  from 代表从哪个路径跳转而来
//  next 是一个函数, 表示放行
  if (to.path === '/login') {
    return next()
  }
  //  获取token
  const token = window.sessionStorage.getItem('Authorization')
  if (!token) {
    return next('/login')
  }
  next()
})

export default router
