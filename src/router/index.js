import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('../pages/Dashboard.vue')
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../pages/Login.vue')
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('../pages/Register.vue')
  },
  {
    path: '/profile',
    name: 'Profile',
    component: () => import('../pages/Profile.vue')
  },
  {
    path: '/economy',
    name: 'Economy',
    component: () => import('../pages/Economy.vue')
  },
  {
    path: '/productivity',
    name: 'Productivity',
    component: () => import('../pages/Productivity.vue')
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
