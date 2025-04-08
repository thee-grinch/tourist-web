// router/index.js
import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/HomeView.vue')
    },
    {
      path: '/destinations',
      name: 'destinations',
      component: () => import('@/views/DestinationsView.vue')
    },
    {
      path: '/destinations/:id',
      name: 'destination',
      component: () => import('@/views/DestinationsView.vue'),
      props: true
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/auth/LoginView.vue'),
      meta: { guestOnly: true }
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('@/views/auth/RegisterView.vue'),
      meta: { guestOnly: true }
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: () => import('@/views/user/DashboardView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/admin',
      name: 'admin',
      component: () => import('@/views/admin/AdminDashboard.vue'),
      meta: { requiresAuth: true, requiresAdmin: true },
      children: [
        {
          path: 'destinations',
          component: () => import('@/views/admin/DestinationManagement.vue')
        },
        // {
        //   path: 'bookings',
        //   component: () => import('@/views/admin/BookingsManagement.vue')
        // }
      ]
    }
  ]
});

router.beforeEach(async (to, from) => {
  const authStore = useAuthStore();
  
  if (!authStore.user && authStore.token) {
    await authStore.checkAuth();
  }

  if (to.meta.requiresAuth && !authStore.token) {
    return { name: 'login', query: { redirect: to.fullPath } };
  }

  if (to.meta.requiresAdmin && authStore.user?.role !== 'admin') {
    return { name: 'home' };
  }

  if (to.meta.guestOnly && authStore.token) {
    return { name: 'home' };
  }
});

export default router;