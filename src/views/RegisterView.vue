<template>
  <div class="signup-container">
    <h1 class="title">Sign Up</h1>
    <form @submit.prevent="handleRegister" class="form">
      <div>
        <label class="label">Name</label>
        <input v-model="firstName" type="text" class="input" required />
      </div>

      <div>
        <label class="label">Last Name</label>
        <input v-model="lastName" type="text" class="input" required />
      </div>

      <div>
        <label class="label">Email</label>
        <input v-model="email" type="email" class="input" required />
      </div>

      <div>
        <label class="label">Password</label>
        <input v-model="password" type="password" class="input" required minlength="6" />
      </div>

      <div>
        <label class="label">Confirm Password</label>
        <input v-model="confirmPassword" type="password" class="input" required />
      </div>

      <div>
        <label class="label">Profile Image</label>
        <input type="file" @change="onFileChange" class="input" accept="image/*" />
      </div>

      <div>
        <label class="label">Role</label>
        <select v-model="role" class="input" required>
          <option value="Buyer">Buyer</option>
          <option value="Seller">Seller</option>
        </select>
      </div>

      <div class="checkbox-wrapper">
        <input type="checkbox" class="checkbox" id="terms" required />
        <label for="terms" class="checkbox-label">Terms and Conditions</label>
      </div>

      <button type="submit" class="btn" :disabled="loading">
        {{ loading ? 'Creating account...' : 'Create Account' }}
      </button>

      <p v-if="error" class="error-message">{{ error }}</p>

      <p class="footer-text">
        Already have an account?
        <a href="/login" class="link">Login</a>
      </p>
    </form>
  </div>
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
    // Validaciones
    if (!firstName.value.trim() || !lastName.value.trim() || 
        !email.value.trim() || !password.value.trim() || 
        !confirmPassword.value.trim()) {
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
      Image: imageBase64.value
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
