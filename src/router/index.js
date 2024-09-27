import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/dashboard',
      name: 'dashboard',
      meta: { requiresAuth: true },
      // component: Home
      component: () => import('../views/Dashboard.vue')
    },
    {
      path: '/register',
      name: 'register',
      // component: Home
      component: () => import('../views/Register.vue')
    },
    {
      path: '/login',
      name: 'login',
      // component: Home
      component: () => import('../views/Login.vue')
    },
  ]
})

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token');
  if (to.matched.some(record => record.meta.requiresAuth) && !token) {
    next('/login');
  } else {
    next();
  }
});
export default router
