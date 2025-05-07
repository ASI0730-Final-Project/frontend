<template>
  <div class="container">
    <div class="login-box">
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

        <div class="options">
          <label class="checkbox-label">
            <input type="checkbox" class="checkbox" />
            Remember me
          </label>
          <a href="#" class="link">Forgot password?</a>
        </div>

        <button type="submit" class="btn">Login</button>

        <p class="footer-text">
          No account?
          <a href="/register" class="link-bold">Sign up here</a>
        </p>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
const email = ref('')
const password = ref('')
const login = () => {
  alert(`Iniciaste sesión con: ${email.value}`)
}
</script>

<style scoped>
.container {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f3f4f6;
  padding: 1rem;
}
.login-box {
  background-color: white;
  padding: 2.5rem;
  border-radius: 1rem;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
}
.title {
  font-size: 1.875rem;
  font-weight: 700;
  margin-bottom: 2rem;
  text-align: center;
  color: #1f2937;
}
.form {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}
.label {
  display: block;
  font-size: 0.875rem;
  margin-bottom: 0.25rem;
  color: #374151;
}
.input {
  width: 100%;
  padding: 0.5rem 1rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  outline: none;
}
.input:focus {
  border-color: #60a5fa;
  box-shadow: 0 0 0 2px #bfdbfe;
}
.options {
  display: flex;
  justify-content: space-between;
  font-size: 0.875rem;
  color: #6b7280;
}
.checkbox-label {
  display: flex;
  align-items: center;
}
.checkbox {
  margin-right: 0.5rem;
}
.link {
  color: #6b7280;
  text-decoration: none;
}
.link:hover {
  text-decoration: underline;
}
.btn {
  width: 100%;
  background-color: #000;
  color: #fff;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  font-weight: 600;
  border: none;
  cursor: pointer;
  transition: background-color 0.3s;
}
.btn:hover {
  background-color: #1f2937;
}
.footer-text {
  text-align: center;
  font-size: 0.875rem;
  color: #6b7280;
}
.link-bold {
  font-weight: 600;
  color: #000;
  text-decoration: none;
}
.link-bold:hover {
  text-decoration: underline;
}
</style>
