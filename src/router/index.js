import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/home'
  },
  {
    path: '/home',
    component: () => import('../views/home')
  },
  {
    path: '/prod',
    component: () => import('../views/prod')
  },
  {
    path: '/evaluate',
    component: () => import('../views/evaluate')
  },
  {
    path: '/login',
    component: () => import('../views/login')
  },
  {
    path: '/noticeList',
    component: () => import('../views/noticeList')
  },
  {
    path: '/noticeDetail',
    component: () => import('../views/noticeDetail')
  },
  {
    path: '/result',
    component: () => import('../views/result')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
