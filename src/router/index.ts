import { createRouter, createWebHashHistory } from 'vue-router'

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/builder'
    },
    {
      path: '/faction',
      name: 'faction',
      component: () => import('../views/FactionListView.vue'),
    },
    {
      path: '/builder',
      name: 'home',
      component: () => import('../views/SquadBuilder.vue'),
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/builder'
    }
  ]
})

export default router
