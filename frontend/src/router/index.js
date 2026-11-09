import { createRouter, createWebHistory } from 'vue-router'

import Landing_page from '@/Views/Landing_page.vue'
import Login from '@/Views/Login.vue'
import Sign_up from '@/Views/Sign_up.vue'
import User_dashboard from '@/Views/User_dashboard.vue'
import Vet_dashboard from '@/Views/Vet_dashboard.vue'
import Groomer_dashboard from '@/Views/Groomer_dashboard.vue'
import Walker_dashboard from '@/Views/Walker_dashboard.vue'
import Forgot_password from '@/Views/Forgot_password.vue'
import User_pet from '@/Views/User_pet.vue'
import { getSessionRole, hasAccessToken } from '@/services/api'

const routes = [
  {
    path: '/',
    name: 'inicio',
    component: Landing_page
  },
  {
    path: '/login',
    name: 'login',
    component: Login
  },
  {
    path: '/sign_up',
    name: 'sign_up',
    component: Sign_up
  },
  {
    path: '/user_dashboard',
    name: 'user_dashboard',
    meta: { requiresAuth: true, role: 'dueno' },
    component: User_dashboard
  },
  {
    path: '/vet_dashboard',
    name: 'vet_dashboard',
    meta: { requiresAuth: true, role: 'veterinario' },
    component: Vet_dashboard
  },
  {
    path: '/groomer_dashboard',
    name: 'groomer_dashboard',
    meta: { requiresAuth: true, role: 'peluquero' },
    component: Groomer_dashboard
  },
  {
    path: '/walker_dashboard',
    name: 'walker_dashboard',
    meta: { requiresAuth: true, role: 'paseador' },
    component: Walker_dashboard
  },
  {
    path: '/forgot_password',
    name: 'forgot_password',
    component: Forgot_password
  },
  {
    path: '/user_pet',
    name: 'user_pet',
    meta: { requiresAuth: true },
    component: User_pet
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to) => {
  if (to.meta.requiresAuth && !hasAccessToken()) {
    return { name: 'login' }
  }

  if (to.meta.role && to.meta.role !== getSessionRole()) {
    return { name: 'login' }
  }

  return true
})

export default router