import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/principalView.vue')
    },
    {
      path: '/eventos',
      name: 'eventos',
      component: () => import('@/views/eventosView.vue')
    }
  ]
})

export default router
