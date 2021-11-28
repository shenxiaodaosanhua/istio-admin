import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: { title: 'Dashboard', icon: 'dashboard' }
    }]
  },
  {
    path: '/ingress',
    component: Layout,
    redirect: '/ingress/index',
    name: 'ingress管理',
    meta: { title: 'ingress管理', icon: 'el-icon-s-help' },
    children: [
      {
        path: '/ingress/index',
        name: 'ingress-index',
        component: () => import('@/views/ingress/index'),
        meta: { title: 'ingress列表', icon: 'el-icon-s-help' }
      },
      {
        path: '/ingress/detail',
        name: 'ingress-detail',
        hidden: true,
        component: () => import('@/views/ingress/detail'),
        meta: { title: 'ingress详情', icon: 'el-icon-s-help' }
      }
    ]
  },
  {
    path: '/Istio管理',
    component: Layout,
    redirect: '/istio/vs/index',
    name: 'Istio管理',
    meta: { title: 'Istio管理', icon: 'el-icon-s-help' },
    children: [
      {
        path: '/istio/vs/index',
        name: 'vs-index',
        component: () => import('@/views/istio/vs/index'),
        meta: { title: '虚拟服务', icon: 'table' }
      },
      {
        path: '/istio/vs/create',
        name: 'vs-create',
        hidden: true,
        component: () => import('@/views/istio/vs/create'),
        meta: { title: '创建虚拟服务', icon: 'table' }
      },
      {
        path: '/istio/vs/detail',
        name: 'vs-detail',
        hidden: true,
        component: () => import('@/views/istio/vs/detail'),
        meta: { title: '虚拟服务详情', icon: 'table' }
      },
      {
        path: '/istio/gw/index',
        name: 'gw-index',
        component: () => import('@/views/istio/gw/index'),
        meta: { title: '网关服务', icon: 'table' }
      },
      {
        path: '/istio/gw/create',
        name: 'gw-create',
        hidden: true,
        component: () => import('@/views/istio/gw/create'),
        meta: { title: '创建网关', icon: 'table' }
      }
    ]
  },
  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
