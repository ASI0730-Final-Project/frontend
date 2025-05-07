<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

function goToLogin() {
  router.push('/login')
}

function goToRegister() {
  router.push('/register')
}

function goToHome() {
  router.push('/')
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
        <a href="#" class="orders-link">Orders</a>
        <div class="actions">
          <button-l class="log-button login" @click="goToLogin">Login</button-l>
          <button class="auth-button register" @click="goToRegister">Sign up</button>
        </div>
        <div class="avatar">
          <div class="dot"></div>
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
  margin: 0;
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
.main-nav a,
.actions a,
.actions button {
  margin-left: 15px;
  text-decoration: none;
  color: #ffffff;
}
.actions button {
  padding: 8px 15px;
  border-radius: 10px;
  background-color: #5ACAE6;
  cursor: pointer;
}
.actions button-l{
  color: #666;
  text-decoration: none; 
  transition: color 0.2s;
  padding: 8px 15px;
  cursor: pointer;
}
.actions button-l:hover {
  color: #5acae6;
  padding: 8px 15px;
  cursor: pointer;
}
.actions button.signup {
  background-color: #4ebfec; /* Color similar al de la imagen */
  color: rgb(72, 224, 235);
  border-color: #63deee;
}
.logo {
  height: 30px;
  margin-right: 8px;
}
.brand-name {
  font-weight: bold;
  font-size: 1.4rem;
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
.avatar {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background-color: #c0c0c0;
  position: relative;
}
.dot {
  width: 6px;
  height: 6px;
  background-color: #1dbf73;
  border-radius: 50%;
  position: absolute;
  bottom: 2px;
  right: 2px;
}

log-button{
  background-color: #1dbf73;
}

</style>
