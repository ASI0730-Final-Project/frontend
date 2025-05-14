import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/stores/userStore'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/HomeView.vue'),
      meta: { requiresAuth: false }
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('@/views/AboutView.vue'),
      meta: { requiresAuth: false }
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/LoginView.vue'),
      meta: { requiresAuth: false, hideIfLoggedIn: true }
    },
    {
      path: '/email-verification-login',
      name: 'email-verification-login',
      component: () => import('@/views/VerificationLoginView.vue'),
      meta: { requiresAuth: false }
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('@/views/RegisterView.vue'),
      meta: { requiresAuth: false, hideIfLoggedIn: true }
    },
    {
      path: '/forgot',
      name: 'forgot',
      component: () => import('@/views/ForgotView.vue'),
      meta: { requiresAuth: false }
    },
    {
      path: '/email-verification-password',
      name: 'email-verification-password',
      component: () => import('@/views/VerificationPasswordView.vue'),
      meta: { requiresAuth: false }
    },
    {
      path: '/sellers',
      name: 'sellers',
      component: () => import('@/views/HomeSellersView.vue'),
      meta: { requiresAuth: true, roles: ['Seller'] }
    },
    {
      path: '/details',
      name: 'details',
      component: () => import('@/views/DetailsView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/wannasell',
      name: 'wannasell',
      component: () => import('@/views/WannaSellView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/service/:serviceId',
      name: 'ServiceOverview',
      component: () => import('@/views/ServiceOverviewView.vue'),
      props: true,
      meta: { requiresAuth: true }
    },
    {
      path: '/createGigView',
      name: 'createGigView',
      component: () => import('@/views/CreateGigView.vue'),
      meta: { requiresAuth: true, roles: ['Seller'] }
    },
    {
      path: '/VVV',
      name: 'VVVV',
      component: () => import('@/views/VerificationPasswordView.vue'),
      meta: { requiresAuth: false }
    },
    // Ruta para manejar accesos no autorizados
    {
      path: '/unauthorized',
      name: 'unauthorized',
      component: () => import('@/views/UnauthorizedView.vue'),
      meta: { requiresAuth: false }
    },
    // Ruta de catch-all para 404
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('@/views/NotFoundView.vue'),
      meta: { requiresAuth: false }
    }
  ]
})


export default router
