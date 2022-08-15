import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/faction/:faction',
      name: 'selected faction',
      component: () => import('../views/FactionListView.vue'),
      props: true
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
      path: '/builder/:faction',
      name: 'builder',
      component: () => import('../views/SquadBuilder.vue'),
      props: true
    },
    {
      path: '/.*/',
      redirect: '/faction'
    }
  ]
})

export default router
