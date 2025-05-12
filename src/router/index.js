import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LoginView from '@/views/LoginView.vue'
import RegisterView from '@/views/RegisterView.vue'
import ForgotView from '@/views/ForgotView.vue'
import HomeSellersView from '@/views/HomeSellersView.vue'
import WannaSellView from '@/views/WannaSellView.vue'
import EmailVerificationSent from '@/views/VerificationLoginView.vue'

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
      path: '/email-verification-sent',
      name: 'email-verification-sent',
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
      path: '/sellers',
      name: 'sellers',
      component: HomeSellersView,
    },
    {
      path: '/wannasell',
      name: 'wannasell',
      component: WannaSellView,
    },
  ],
})

export default router
