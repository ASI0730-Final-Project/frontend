<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/userStore'

const router = useRouter()
const userStore = useUserStore()

// Initialize user from store
onMounted(() => {
  userStore.initializeUser()
})

function goToLogin() {
  router.push('/login')
}

function goToRegister() {
  router.push('/register')
}

function goToHome() {
  router.push('/')
}

function logout() {
  userStore.logoutUser()
}
</script>

<template>
  <header class="app-header">
    <div class="container">
      <div class="left-section">
        <img src="/src/components/icons/logo.png" alt="Logo" class="logo" @click="goToHome" />
      </div>

      <div class="right-section">
        <i class="pi pi-heart icon"></i>
        <i class="pi pi-bell icon"></i>
        <i class="pi pi-envelope icon"></i>

        <!-- Show different links based on role -->
        <template v-if="userStore.isLoggedIn">
          <a v-if="userStore.user.Rol === 'Buyer'" href="#" class="orders-link">My Orders</a>
          <a v-if="userStore.user.Rol === 'Seller'" href="/createGigView" class="orders-link"
            >Create Gig</a
          >

          <div class="user-info">
            <img
              :src="userStore.user.Image || 'https://via.placeholder.com/40'"
              alt="Avatar"
              class="avatar-img"
            />
            <span class="user-name">{{ userStore.user.Name }}</span>
            <button class="auth-button logout" @click="logout">{{ $t('header.logout') }}</button>
          </div>
        </template>
        <template v-else>
          <button class="auth-button login" @click="goToLogin">{{ $t('header.login') }}</button>
          <button class="auth-button register" @click="goToRegister">
            {{ $t('header.register') }}
          </button>
        </template>
      </div>
    </div>

    <div class="container-links">
      <nav class="main-nav">
        <a href="#">{{ $t('categories.programming') }}</a>
        <a href="#">{{ $t('categories.design') }}</a>
        <a href="#">{{ $t('categories.writing') }}</a>
        <a href="#">{{ $t('categories.marketing') }}</a>
        <a href="#">{{ $t('categories.video') }}</a>
        <a href="#">{{ $t('categories.music') }}</a>
        <a href="#">{{ $t('categories.photo') }}</a>
        <a href="#">{{ $t('categories.business') }}</a>
      </nav>
    </div>
  </header>
</template>

<style scoped>
.app-header {
  background-color: #fff;
  border-bottom: 1px solid #eee;
  padding: 10px 0;
  font-family: 'Helvetica Neue', sans-serif;
  font-size: 14px;
}
.container {
  height: 40px;
  padding: 0 15px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #eee;
}
.container-links {
  margin-top: 10px;
  padding: 0 15px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.left-section {
  display: flex;
  align-items: center;
}
.logo {
  height: 30px;
  margin-right: 8px;
  cursor: pointer;
}
.right-section {
  display: flex;
  align-items: center;
  gap: 15px;
}
.icon {
  font-size: 1.2rem;
  cursor: pointer;
  color: #444;
}
.orders-link {
  text-decoration: none;
  color: #555;
}
.actions {
  display: flex;
  align-items: center;
  gap: 10px;
}
.auth-button {
  padding: 8px 15px;
  border-radius: 10px;
  background-color: #5acae6;
  color: white;
  border: none;
  cursor: pointer;
  font-weight: 500;
}
.auth-button.login {
  background-color: #1dbf73;
}
.auth-button.register {
  background-color: #4ebfec;
}
.auth-button.logout {
  background-color: #f56565;
}
.user-info {
  display: flex;
  align-items: center;
  gap: 10px;
}
.avatar-img {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  object-fit: cover;
  border: 1px solid #ccc;
}
.user-name {
  font-weight: 500;
  color: #333;
}
.main-nav {
  flex: 1;
  display: flex;
  justify-content: center;
  gap: 18px;
}
.main-nav a {
  color: #666;
  text-decoration: none;
  transition: color 0.2s;
}
.main-nav a:hover {
  color: #5acae6;
}
</style>
