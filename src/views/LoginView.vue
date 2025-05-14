<template>
  <div class="login-container">
    <h1 class="title">{{ $t('loginPage.login') }}</h1>
    <form @submit.prevent="handleLogin" class="form">
      <div>
        <label class="label">{{ $t('loginPage.email') }}</label>
        <input v-model="email" type="email" class="input" required />
      </div>

      <div>
        <label class="label">{{ $t('loginPage.password') }}</label>
        <input v-model="password" type="password" class="input" required />
      </div>

      <div class="checkbox-wrapper">
        <input type="checkbox" class="checkbox" id="remember" />
        <label for="remember" class="checkbox-label">{{ $t('loginPage.rememberMe') }}</label>
        <a href="#" class="link2" @click.prevent="goToVerificationLogin">{{
          $t('loginPage.forgotPassword')
        }}</a>
      </div>

      <button type="submit" class="btn" :disabled="loading">
        {{ loading ? $t('loginPage.loggingIn') : $t('loginPage.login') }}
      </button>

      <p v-if="error" class="error-message">{{ error }}</p>

      <p class="footer-text">
        {{ $t('loginPage.noAccount') }}
        <a href="/register" class="link">{{ $t('loginPage.signUp') }}</a>
      </p>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/userStore'

const email = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)
const router = useRouter()
const userStore = useUserStore()

const handleLogin = async () => {
  error.value = ''
  loading.value = true

  try {
    if (!email.value.trim() || !password.value.trim()) {
      throw new Error('Por favor, complete todos los campos')
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email.value)) {
      throw new Error('Ingrese un email válido')
    }

    const API_URL = 'https://6823dd5865ba058033981a59.mockapi.io/users'
    const query = `?Email=${encodeURIComponent(email.value)}`
    const fullUrl = API_URL + query

    const response = await fetch(fullUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (response.status === 404) {
      throw new Error('El usuario no existe')
    }

    if (!response.ok) {
      throw new Error(`Error en la API: ${response.status}`)
    }

    const users = await response.json()

    if (!users || users.length === 0) {
      throw new Error('No hay una cuenta con este email')
    }

    const user = users[0]

    if (user.Password !== password.value) {
      throw new Error('Contraseña incorrecta')
    }

    userStore.user = user
    userStore.isLoggedIn = true
    localStorage.setItem('user', JSON.stringify(user))

    const redirectPath = user.Rol === 'Seller' ? '/sellers' : '/'
    router.push(redirectPath)
  } catch (err) {
    console.error('Error en login:', err)
    error.value = err.message || 'Error al iniciar sesión'
  } finally {
    loading.value = false
  }
}

const goToVerificationLogin = () => {
  if (!email.value) {
    error.value = 'Ingrese su email primero'
    return
  }
  router.push({ name: 'email-verification-login', query: { email: email.value } })
}
</script>

<style scoped>
.error-message {
  color: red;
  margin-top: 1rem;
  text-align: center;
}

.login-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: #f7f7f7;
  padding: 1rem;
}

.title {
  font-size: 3rem;
  font-weight: bold;
  color: #0f2c32;
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
  color: #0f2c32;
}

.input {
  width: 100%;
  padding: 0.6rem 0.75rem;
  border: 1px solid #939393;
  background-color: #ffffff;
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
  color: #bcbcbc;
  font-weight: 500;
  text-decoration: underline;
  margin-left: 0.25rem;
}
</style>
