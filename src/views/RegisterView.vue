<template>
  <main class="signup-container" role="main" aria-labelledby="registration-heading">
    <h1 id="registration-heading" class="title">{{ $t('registerPage.title') }}</h1>
    <form
      @submit.prevent="handleRegister"
      class="form"
      role="form"
      aria-label="User registration form"
    >
      <div role="group" aria-labelledby="firstName-label">
        <label id="firstName-label" class="label">{{ $t('registerPage.name') }}</label>
        <input
          v-model="firstName"
          type="text"
          class="input"
          required
          aria-required="true"
          :aria-label="$t('registerPage.name')"
        />
      </div>

      <div role="group" aria-labelledby="lastName-label">
        <label id="lastName-label" class="label">{{ $t('registerPage.lastName') }}</label>
        <input
          v-model="lastName"
          type="text"
          class="input"
          required
          aria-required="true"
          :aria-label="$t('registerPage.lastName')"
        />
      </div>

      <div role="group" aria-labelledby="email-label">
        <label id="email-label" class="label">{{ $t('registerPage.email') }}</label>
        <input
          v-model="email"
          type="email"
          class="input"
          required
          aria-required="true"
          :aria-label="$t('registerPage.email')"
        />
      </div>

      <div role="group" aria-labelledby="password-label">
        <label id="password-label" class="label">{{ $t('registerPage.password') }}</label>
        <input
          v-model="password"
          type="password"
          class="input"
          required
          minlength="6"
          aria-required="true"
          :aria-label="$t('registerPage.password')"
          aria-describedby="password-requirements"
        />
        <span id="password-requirements" class="sr-only">Minimum 6 characters required</span>
      </div>

      <div role="group" aria-labelledby="confirmPassword-label">
        <label id="confirmPassword-label" class="label">{{ $t('registerPage.confirmPassword') }}</label>
        <input
          v-model="confirmPassword"
          type="password"
          class="input"
          required
          aria-required="true"
          :aria-label="$t('registerPage.confirmPassword')"
        />
      </div>

      <div role="group" aria-labelledby="profileImage-label">
        <label id="profileImage-label" class="label">{{ $t('registerPage.profileImage') }}</label>
        <input
          type="file"
          @change="onFileChange"
          class="input"
          accept="image/*"
          :aria-label="$t('registerPage.profileImage')"
        />
      </div>

      <div role="group" aria-labelledby="role-label">
        <label id="role-label" class="label">{{ $t('registerPage.role') }}</label>
        <select
          v-model="role"
          class="input"
          required
          aria-required="true"
          :aria-label="$t('registerPage.role')"
        >
          <option value="Buyer">{{ $t('registerPage.buyer') }}</option>
          <option value="Seller">{{ $t('registerPage.seller') }}</option>
        </select>
      </div>

      <div class="checkbox-wrapper" role="group" aria-labelledby="terms-label">
        <input
          type="checkbox"
          class="checkbox"
          id="terms"
          required
          aria-required="true"
          :aria-label="$t('registerPage.terms')"
        />
        <label for="terms" id="terms-label" class="checkbox-label">
          {{ $t('registerPage.terms') }}
        </label>
      </div>

      <button
        type="submit"
        class="btn"
        :disabled="loading"
        :aria-busy="loading"
        aria-live="polite"
      >
        {{ loading ? $t('registerPage.creating') : $t('registerPage.create') }}
      </button>

      <p v-if="error" class="error-message" role="alert" aria-live="assertive">
        {{ error }}
      </p>

      <p class="footer-text">
        {{ $t('registerPage.already') }}
        <a
          href="/login"
          class="link"
          :aria-label="$t('registerPage.login')"
        >
          {{ $t('registerPage.login') }}
        </a>
      </p>
    </form>
  </main>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/userStore'

const firstName = ref('')
const lastName = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const role = ref('Buyer')
const imageBase64 = ref('')
const error = ref('')
const loading = ref(false)
const router = useRouter()
const userStore = useUserStore()

const onFileChange = (e) => {
  const file = e.target.files[0]
  if (file) {
    const reader = new FileReader()
    reader.onload = () => {
      imageBase64.value = reader.result
    }
    reader.readAsDataURL(file)
  }
}

const handleRegister = async () => {
  error.value = ''
  loading.value = true

  try {
    if (
      !firstName.value.trim() ||
      !lastName.value.trim() ||
      !email.value.trim() ||
      !password.value.trim() ||
      !confirmPassword.value.trim()
    ) {
      throw new Error('Please fill in all required fields')
    }

    if (password.value !== confirmPassword.value) {
      throw new Error('Passwords do not match')
    }

    if (password.value.length < 6) {
      throw new Error('Password must be at least 6 characters')
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email.value)) {
      throw new Error('Please enter a valid email address')
    }

    const userData = {
      Name: firstName.value.trim(),
      LastName: lastName.value.trim(),
      Email: email.value.trim(),
      Password: password.value,
      Rol: role.value,
      Image: imageBase64.value,
    }

    await userStore.registerUser(userData)
    router.push(userStore.user.Rol === 'Seller' ? '/sellers' : '/')
  } catch (err) {
    error.value = err.message || 'Registration failed. Please try again.'
    console.error('Registration error details:', err)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.error-message {
  color: red;
  margin-top: 1rem;
  text-align: center;
}

.signup-container {
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
  font-size: 1rem;
  margin-bottom: 0.25rem;
  color: #252525;
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

.btn {
  width: 100%;
  background-color: #0f2c32;
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
</style>
