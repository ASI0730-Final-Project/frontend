<template>
  <div class="login-container">
    <h1 class="title">Login</h1>
    <form @submit.prevent="login" class="form">
      <div>
        <label class="label">Email</label>
        <input v-model="email" type="email" class="input" />
      </div>

      <div>
        <label class="label">Password</label>
        <input v-model="password" type="password" class="input" />
      </div>

      <div class="checkbox-wrapper">
        <input type="checkbox" class="checkbox" id="remember" />
        <label for="remember" class="checkbox-label">Remember me</label> <a href="/forgot" class="link2">Forgot your Password?</a>
      </div>

      <button type="submit" class="btn">Login</button>
      

      <p class="footer-text">
        No account?
        <a href="/register" class="link">Sign up here</a>
      </p>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
const email = ref('')
const password = ref('')
const login = () => {
  alert(`Logged in with: ${email.value}`)
  router.push('/')
}
import { useRouter } from 'vue-router'

const router = useRouter()


</script>

<style scoped>
.login-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: #F7F7F7;
  padding: 1rem;
}

.title {
  font-size: 3rem;
  font-weight: bold;
  color: #0F2C32;
  margin-bottom: 2rem;
}

.form {
  width: 100%;
  max-width: 400px;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.label {
  font-size: 0.95rem;
  margin-bottom: 0.25rem;
  color: #0F2C32;
}

.input {
  width: 100%;
  padding: 0.6rem 0.75rem;
  border: 1px solid #939393;
  background-color: #FFFFFF;
  border-radius: 8px;
  font-size: 1rem;
  outline: none;
}

.input:focus {
  border-color: #60a5fa;
  box-shadow: 0 0 0 2px #bfdbfe;
}

.checkbox-wrapper {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
}

.checkbox {
  width: 16px;
  height: 16px;
}

.btn {
  width: 100%;
  background-color: #0f2f2f;
  color: white;
  font-size: 1rem;
  font-weight: 500;
  padding: 0.6rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
}

.btn:hover {
  background-color: #103838;
}

.footer-text {
  text-align: center;
  margin-top: 1rem;
  font-size: 0.9rem;
  color: #000;
}

.link {
  color: #000;
  font-weight: 500;
  text-decoration: underline;
  margin-left: 0.25rem;
}

.link2 {
  color: #BCBCBC;
  font-weight: 500;
  text-decoration: underline;
  margin-left: 0.25rem;
}
</style>
