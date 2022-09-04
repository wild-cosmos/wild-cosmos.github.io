import { createRouter, createWebHashHistory } from 'vue-router'
import ReferenceGuide from '../views/ReferenceGuide.vue'
import WarbandBuilder from '../views/WarbandBuilder.vue'

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/builder'
    },
    {
      path: '/reference',
      name: 'reference',
      component: ReferenceGuide,
    },
    {
      path: '/builder',
      name: 'home',
      component: WarbandBuilder,
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/builder'
    }
  ]
})

export default router
