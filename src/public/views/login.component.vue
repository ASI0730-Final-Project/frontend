<script setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { authService } from '../../shared/services/auth.service'

const { t } = useI18n()
const router = useRouter()

const email = ref('')
const password = ref('')
const error = ref(null)
const loading = ref(false)

const handleLogin = async () => {
  try {
    loading.value = true
    error.value = null

    if (!email.value || !password.value) {
      error.value = t('auth.fillAllFields')
      return
    }

    const response = await authService.login({
      email: email.value.trim(),
      password: password.value.trim(),
    })

    if (response?.token && response?.user) {
      localStorage.setItem('token', response.token)
      localStorage.setItem('user', JSON.stringify(response.user))

      const role = response.user.role
      if (role === 'buyer') router.push({ name: 'buyerProfile' })
      else if (role === 'seller') router.push({ name: 'userProfile' })
      else router.push({ name: 'home' })
    } else {
      error.value = t('auth.invalidCredentials')
    }
  } catch (err) {
    console.error('Login error:', err.response || err)
    if (err.response?.status === 401) {
      error.value = err.response.data?.message || t('auth.invalidCredentials')
    } else if (err.response?.status === 500) {
      error.value = t('auth.serverError') || 'Unexpected server error'
    } else {
      error.value = t('auth.loginFailed')
    }
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="login-container">
    <div class="login-card">
      <h1 class="login-title">{{ t('auth.login') }}</h1>
      <form @submit.prevent="handleLogin" class="login-form">
        <div class="login-field">
          <label for="email">{{ t('auth.email') }}</label>
          <pv-input-text id="email" v-model="email" type="email" required />
        </div>
        <div class="login-field">
          <label for="password">{{ t('auth.password') }}</label>
          <pv-input-text id="password" v-model="password" type="password" required />
        </div>
        <pv-button type="submit" :label="t('auth.submit')" class="login-btn" :loading="loading" />
        <div v-if="error" class="login-error">{{ error }}</div>
        <div class="login-link">
          <router-link :to="{ name: 'register' }">{{ t('auth.noAccount') }}</router-link>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
.login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #18191d;
}
.login-card {
  background: #23242a;
  border-radius: 16px;
  box-shadow: 0 4px 24px rgba(80, 36, 143, 0.1);
  padding: 2.5rem 2rem;
  width: 100%;
  max-width: 420px;
}
.login-title {
  text-align: center;
  font-size: 2rem;
  color: #7b1fa2;
  margin-bottom: 2rem;
}
.login-form {
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
}
.login-field label {
  font-weight: 500;
  color: #bdbdbd;
  margin-bottom: 0.3rem;
  display: block;
}
.login-field input,
.login-field .p-inputtext {
  width: 100%;
  border-radius: 8px;
  border: 1px solid #7b1fa2;
  background: #18191d;
  color: #fff;
  padding: 0.7rem 1rem;
  font-size: 1rem;
  margin-top: 0.2rem;
  box-shadow: none;
}
.login-field input:focus,
.login-field .p-inputtext:focus {
  outline: none;
  border-color: #b39ddb;
  background: #23242a;
}
.login-btn {
  margin-top: 1.2rem;
  background: #7b1fa2;
  color: #fff;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: 600;
  padding: 0.8rem 0;
  border: none;
  box-shadow: none;
  transition: background 0.2s;
}
.login-btn:hover {
  background: #4a148c;
}
.login-btn:disabled {
  opacity: 0.7;
}
.login-error {
  margin-top: 1rem;
  color: #b71c1c;
  background: #2d1a1a;
  padding: 0.7rem 1rem;
  border-radius: 8px;
  text-align: center;
}
.login-link {
  margin-top: 1.5rem;
  text-align: center;
}
.login-link a {
  color: #7b1fa2;
  text-decoration: underline;
  font-weight: 500;
}
</style>
