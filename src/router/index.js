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
          component: () => import('@/components/organization/AddOrganization')
        },
        {
          path: '/orgList',
          component: () => import('@/components/organization/OrganizationList')
        },
        {
          path: '/addUser',
          component: () => import('@/components/user/AddUser')
        },
        {
          path: '/userList',
          component: () => import('@/components/user/UserList')
        },
        {
          path: '/complateUserInfo',
          component: () => import('@/components/user/ComplateUserInfo')
        },
        {
          path: '/resetPassword',
          component: () => import('@/components/user/ResetPassword')
        },
        {
          path: '/roleListInfo',
          component: () => import('@/components/permission/RoleList')
        },
        {
          path: '/perssionList',
          component: () => import('@/components/permission/PerssionList')
        },
        {
          path: '/addPrescription',
          component: () => import('@/components/prescription/AddPrescription')
        },
        {
          path: '/prescriptonList',
          component: () => import('@/components/prescription/PrescriptionList')
        },
        {
          path: '/circulationInfo',
          component: () => import('@/components/prescription/CirculationInfo')
        },
        {
          path: '/organizationCount',
          component: () => import('@/components/count/OrganizationCount')
        },
        {
          path: '/prescriptionCount',
          component: () => import('@/components/count/PrescriptionCount')
        },
        {
          path: '/userCount',
          component: () => import('@/components/count/UserCount')
        },
        {
          path: '/sendMessage',
          component: () => import('@/components/message/SendMessage')
        },
        {
          path: '/inBox',
          component: () => import('@/components/message/InBox')
        },
        {
          path: '/outBox',
          component: () => import('@/components/message/OutBox')
        },
        {
          path: '/draftBox',
          component: () => import('@/components/message/DraftBox')
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
