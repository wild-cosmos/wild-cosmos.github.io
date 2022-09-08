import { createRouter, createWebHashHistory } from 'vue-router';
import CoreReference from '@/views/CoreReference.vue';
import ReferenceGuide from '@/views/ReferenceGuide.vue';
import WarbandBuilder from '@/views/WarbandBuilder.vue';

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/builder',
    },
    {
      path: '/reference',
      name: 'reference',
      component: ReferenceGuide,
      props: (route) => ({ ...route.query }),
    },
    {
      path: '/rules',
      name: 'rules',
      component: CoreReference,
      props: (route) => ({ ...route.query }),
    },
    {
      path: '/builder',
      name: 'home',
      component: WarbandBuilder,
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/builder',
    },
  ],
});

export default router;
