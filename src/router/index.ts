import { createRouter, createWebHashHistory } from 'vue-router';

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
      component: () => import('@/views/ReferenceGuide.vue'),
      props: (route) => ({ ...route.query }),
    },
    {
      path: '/rules',
      name: 'rules',
      component: () => import('@/views/CoreReference.vue'),
      props: (route) => ({ ...route.query }),
    },
    {
      path: '/builder',
      name: 'home',
      component: () => import('@/views/WarbandBuilder.vue'),
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/builder',
    },
  ],
});

export default router;
