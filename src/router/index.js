import { createRouter, createWebHistory } from "vue-router"
import HomeComponent from '../public/views/home.component.vue'
import GigsComponent from '../public/views/gigs.component.vue'
import LoginComponent from '../public/views/login.component.vue'
import RegisterComponent from '../public/views/register.component.vue'
import CreateGigComponent from '../gigs/views/create-gig.component.vue'
import GigDetailComponent from '../gigs/views/gig-detail.component.vue'
import PageNotFoundComponent from '../public/views/page-not-found.component.vue'
import SellerGigsComponent from '../public/views/seller-gigs.component.vue'
import PullBuyerView from '../pull/views/PullBuyerView.component.vue'
import PullSellerView from '../pull/views/PullSellerView.component.vue'
import SellerPullsView from '../pull/views/SellerPullsView.component.vue'
import BuyerPullsView from '../pull/views/BuyerPullsView.component.vue'
import UserProfileView from '../shared/views/UserProfileView.component.vue'
import BuyerProfileView from '../shared/views/BuyerProfileView.component.vue'
import PullNegotiationView from '../pull/views/PullNegotiationView.component.vue'
import NewPortfolioFormView from '../portfolio/components/NewPortfolioFormView.component.vue'

const routes = [
  { path: '/:pathMatch(.*)*', component: PageNotFoundComponent, name: '404' },
  { path: '/', redirect: '/home' },
  { path: '/home', component: HomeComponent, name: 'home' },
  { path: '/gigs', component: GigsComponent, name: 'gigs' },
  { path: '/gigs/create', component: CreateGigComponent, name: 'createGig' },
  { path: '/gigs/:id', component: GigDetailComponent, name: 'gigDetail' },
  { path: '/login', component: LoginComponent, name: 'login' },
  { path: '/register', component: RegisterComponent, name: 'register' },
  { path: '/seller-gigs', component: SellerGigsComponent, name: 'sellerGigs' },
  { path: '/buyer/pulls', component: PullBuyerView, name: 'buyerPulls' },
  { path: '/seller/pulls', component: PullSellerView, name: 'sellerPulls' },
  { path: '/pull/buyer/:id', component: PullBuyerView, name: 'pullBuyerView' },
  { path: '/pull/seller/:id', component: PullSellerView, name: 'pullSellerView' },
  { path: '/seller-pulls', component: SellerPullsView, name: 'pullListView' },
  { path: '/buyer-pulls', component: BuyerPullsView, name: 'buyerPullListView' },
  { path: '/pull/negotiation/:id', component: PullNegotiationView, name: 'pullNegotiation' },
  { path: '/portfolio/create', component: NewPortfolioFormView, name: 'createPortfolio'},
  { path: '/profile', component: UserProfileView, name: 'userProfile' },
  { path: '/buyer-profile', component: BuyerProfileView, name: 'buyerProfile' },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

router.beforeEach((to, from, next) => {
  console.log(`Navigating to: ${to.path}`)
  next()
})

export default router
