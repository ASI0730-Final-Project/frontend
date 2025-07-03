<template>
  <div class="verification-container" role="main" aria-labelledby="verification-title">
    <div class="card">
      <svg
        class="check-icon"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        aria-hidden="true"
        role="img"
      >
        <circle cx="12" cy="12" r="10" stroke-width="1" />
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M9 12l2 2l4 -4" />
      </svg>

      <p class="message" id="verification-title" role="alert">
        We sent an email to <span class="email">{{ obfuscatedEmail }}</span>. Go to the link in the email to verify this account.
      </p>

      <button class="btn" @click="goToForgot" aria-label="Return to login screen">Log In</button>
    </div>
  </div>
</template>


<script setup>
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const email = route.query.email || ''

let obfuscatedEmail = 'Invalid email'

if (email && email.includes('@')) {
  const [username, domain] = email.split('@')
  if (username.length > 2) {
    obfuscatedEmail = `${username.substring(0, 2)}${'*'.repeat(Math.min(username.length - 2, 5))}@${domain}`
  } else {
    obfuscatedEmail = `${username.substring(0, 1)}${'*'.repeat(Math.min(username.length - 1, 3))}@${domain}`
  }
}

const goToForgot = () => {
  router.push('/forgot')
}
</script>

<style scoped>
.verification-container {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f7f7f7;
  padding: 1rem;
}

.card {
  background-color: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  text-align: center;
  max-width: 400px;
  width: 100%;
}

.check-icon {
  width: 120px;
  height: 120px;
  stroke: #000;
  margin: 0 auto 1rem;
}

.message {
  font-size: 0.95rem;
  color: #333;
  margin-bottom: 1.5rem;
}

.email {
  font-weight: bold;
}

.btn {
  background-color: #0f2c32;
  color: white;
  border: none;
  padding: 0.6rem 1.2rem;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  width: 100%;
}

.btn:hover {
  background-color: #103838;
}
</style>
