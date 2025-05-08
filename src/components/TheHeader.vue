<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const user = ref(null)
const isLoggedIn = ref(false)

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
  localStorage.removeItem('loggedInUser') // <- usamos esta clave ahora
  isLoggedIn.value = false
  user.value = null
  router.push('/login')
}

// Cargar usuario al montar
onMounted(() => {
  const storedUser = JSON.parse(localStorage.getItem('loggedInUser'))
  if (storedUser) {
    user.value = storedUser
    isLoggedIn.value = true
  }
})

// Reactividad: escuchamos los cambios en el localStorage
watch(
  () => localStorage.getItem('loggedInUser'),
  (newValue) => {
    const updatedUser = newValue ? JSON.parse(newValue) : null
    user.value = updatedUser
    isLoggedIn.value = !!updatedUser
  },
  { immediate: true }, // Ejecutar inmediatamente para el primer renderizado
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
        <a href="#" class="orders-link">Orders</a>
        <div class="actions">
          <template v-if="isLoggedIn">
            <div class="user-info">
              <img :src="user.image" alt="Avatar" class="avatar-img" />
              <span class="user-name">{{ user.firstName }}</span>
              <button class="auth-button logout" @click="logout">Cerrar sesión</button>
            </div>
          </template>
          <template v-else>
            <button class="auth-button login" @click="goToLogin">Login</button>
            <button class="auth-button register" @click="goToRegister">Sign up</button>
          </template>
        </div>
      </div>
    </div>

    <div class="container-links">
      <nav class="main-nav">
        <a href="#">Programming & Tech</a>
        <a href="#">Graphics & Design</a>
        <a href="#">Writing & Translation</a>
        <a href="#">Digital Marketing</a>
        <a href="#">Video & Animation</a>
        <a href="#">Music & Audio</a>
        <a href="#">Photography</a>
        <a href="#">Business</a>
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
