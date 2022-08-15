import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/:faction',
      name: 'faction',
      component: () => import('../views/FactionView.vue'),
      props: true
    },
    {
      path: '/',
      name: 'home',
    },
    {
    }
  ]
})

export default router
