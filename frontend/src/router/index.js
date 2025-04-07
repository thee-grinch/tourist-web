import { createRouter, createWebHistory } from 'vue-router'

// Import views
import HomeView from '@/views/HomeView.vue'
import AboutView from '@/views/AboutView.vue'
import LoginView from '@/views/auth/LoginView.vue'
import RegisterView from '@/views/auth/RegisterView.vue'
import DashboardView from '@/views/user/DashboardView.vue'

// Define routes
const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomeView,
  },
  {
    path: '/about',
    name: 'About',
    component: AboutView,
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginView,
  },
  {
    path: '/register',
    name: 'Register',
    component: RegisterView,
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: DashboardView,
  },
  // Admin routes and DestinationModal are commented out because they are not available
  // {
  //   path: '/admin',
  //   name: 'Admin',
  //   component: AdminView,
  //   children: [
  //     {
  //       path: 'destination',
  //       name: 'DestinationModal',
  //       component: DestinationModal,
  //     },
  //   ],
  // },
]

// Create router instance
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router
