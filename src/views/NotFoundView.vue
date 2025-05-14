<template>
  <div class="not-found-container">
    <h1>404 - Page Not Found</h1>
    <p>The page you are looking for doesn't exist or has been moved.</p>
    <button @click="goHome" class="btn">Go to Home</button>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const goHome = () => {
  router.push('/')
}
</script>

<style scoped>
.not-found-container {
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