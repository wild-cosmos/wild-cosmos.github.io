import { getCurrentUser } from 'vuefire';
import { createRouter, createWebHashHistory } from 'vue-router';

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/builder',
    },
    {
      path: '/login',
      component: () => import('@/views/LoginPage.vue'),
    },
    {
      path: '/auth-required',
      name: 'auth-required',
      component: () => import('@/views/AuthRequired.vue'),
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
      component: () => import('@/views/WarbandList.vue'),
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: '/builder/:id',
      name: 'warband',
      component: () => import('@/views/WarbandBuilder.vue'),
      props: ({ params } ) => {
        const { id } = params as { id: string };
        return { id: Number.parseInt(id, 10) };
      },
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/builder',
    },
  ],
});

router.beforeEach(async (to) => {
  // routes with `meta: { requiresAuth: true }` will check for the users, others won't
  if (to.meta?.requiresAuth) {
    const currentUser = await getCurrentUser();
    // if the user is not logged in, redirect to the login page
    if (!currentUser) {
      /*
      return {
        name: 'auth-required',
        query: {
          // we keep the current path in the query so we can redirect to it after login
          // with `router.push(route.query.redirectTo || '/')`
          redirectTo: to.fullPath,
        },
      };
      */
    }
  }
  return true;
});

export default router;
