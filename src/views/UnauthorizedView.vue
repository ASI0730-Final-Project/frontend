<template>
  <div class="unauthorized-container">
    <h1>Unauthorized Access</h1>
    <p>You don't have permission to access this page.</p>
    <p v-if="userStore.user">Your role: {{ userStore.user.Rol }}</p>
    <button @click="goBack" class="btn">Go Back</button>
    <button @click="goHome" class="btn">Go to Home</button>
  </div>
</template>

<script setup>
import { useUserStore } from '@/stores/userStore'
import { useRouter } from 'vue-router'

const userStore = useUserStore()
const router = useRouter()

const goBack = () => {
  router.go(-1)
}

const goHome = () => {
  router.push('/')
}
</script>

<style scoped>
.unauthorized-container {
  max-width: 600px;
  margin: 2rem auto;
  padding: 2rem;
  text-align: center;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
}

h1 {
  color: #ff4444;
  margin-bottom: 1rem;
}

p {
  margin-bottom: 1.5rem;
}

.btn {
  margin: 0 0.5rem;
  padding: 0.5rem 1rem;
  background-color: #42b983;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.btn:hover {
  background-color: #3aa876;
}
</style>