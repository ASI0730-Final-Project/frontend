import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LoginView from '@/views/LoginView.vue'
import RegisterView from '@/views/RegisterView.vue'
import ForgotView from '@/views/ForgotView.vue'
import HomeSellersView from '@/views/HomeSellersView.vue'
import WannaSellView from '@/views/WannaSellView.vue'
import EmailVerificationSent from '@/views/VerificationLoginView.vue'
import DetailsView from '@/views/DetailsView.vue'
import VerificationPasswordView from '@/views/VerificationPasswordView.vue'
import createGigView from '@/views/CreateGigView.vue'


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/AboutView.vue'),
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
    },
    {
      path: '/email-verification-login',
      name: 'email-verification-login',
      component: EmailVerificationSent,
    },
    {
      path: '/register',
      name: 'register',
      component: RegisterView,
    },
    {
      path: '/forgot',
      name: 'forgot',
      component: ForgotView,
    },
    {
      path: '/email-verification-password',
      name: 'email-verification-password',
      component: () => import('@/views/VerificationPasswordView.vue'),
    },
    {
      path: '/sellers',
      name: 'sellers',
      component: HomeSellersView,
    },
    {
      path: '/details',
      name: 'details',
      component: DetailsView,
    },
    {
      path: '/wannasell',
      name: 'wannasell',
      component: WannaSellView,
    },
    {
      path: '/createGigView',
      name: 'createGigView',
      component: createGigView
    },
  ],
})

export default router
