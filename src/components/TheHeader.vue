<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'

const router = useRouter()
const { locale } = useI18n()

const user = ref(null)
const isLoggedIn = ref(false)

function goToLogin() {
  router.push('/')
}

function goToRegister() {
  router.push('/register')
}

function goToHome() {
  router.push('/home')
}

function logout() {
  localStorage.removeItem('loggedInUser')
  isLoggedIn.value = false
  user.value = null
  router.push('/')
}

function changeLanguage(lang) {
  locale.value = lang
  localStorage.setItem('selectedLang', lang)
}

onMounted(() => {
  const storedUser = JSON.parse(localStorage.getItem('loggedInUser'))
  if (storedUser) {
    user.value = storedUser
    isLoggedIn.value = true
  }

  const savedLang = localStorage.getItem('selectedLang')
  if (savedLang) locale.value = savedLang
})

watch(
  () => localStorage.getItem('loggedInUser'),
  (newValue) => {
    const updatedUser = newValue ? JSON.parse(newValue) : null
    user.value = updatedUser
    isLoggedIn.value = !!updatedUser
  },
  { immediate: true },
)
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
        <a href="#" class="orders-link">{{ $t('header.orders') }}</a>

        <select class="language-select" v-model="locale" @change="changeLanguage(locale)">
          <option value="en">🇬🇧 English</option>
          <option value="es">🇪🇸 Español</option>
        </select>

        <div class="actions">
          <template v-if="isLoggedIn">
            <div class="user-info">
              <img :src="user.image" alt="Avatar" class="avatar-img" />
              <span class="user-name">{{ user.firstName }}</span>
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
.language-select {
  padding: 5px 10px;
  border-radius: 6px;
  border: 1px solid #ccc;
  background: #fff;
  font-size: 14px;
  cursor: pointer;
}
</style>
