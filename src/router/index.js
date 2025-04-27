import { createRouter, createWebHistory } from 'vue-router'
<<<<<<< HEAD
import { useUserStore } from '../stores/user.js'
=======
>>>>>>> 024746f10d8611ff8bc4d4fb124bd3f4ca5a2327

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

router.beforeEach((to, from, next) => {
  const userStore = useUserStore()

  const publicPages = ['/login', '/register']
  const authRequired = !publicPages.includes(to.path)
  const loggedIn = !!userStore.token

  if (authRequired && !loggedIn) {
    return next('/login')
  }

  if (!authRequired && loggedIn) {
    return next('/dashboard')
  }

  next()
})

export default router
