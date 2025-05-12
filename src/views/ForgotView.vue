<template>
  <div class="forgot-container">
    <h1 class="title">Forgot your password</h1>
    <form @submit.prevent="forgot" class="form">
      <div>
        <label class="label">Email</label>
        <input v-model="email" type="email" class="input" required />
      </div>

      <div>
        <label class="label">Password</label>
        <input v-model="password" type="password" class="input" required />
      </div>

      <div>
        <label class="label">Confirm password</label>
        <input v-model="confirmPassword" type="password" class="input" required />
      </div>

      <div class="checkbox-wrapper">
        <input v-model="termsAccepted" type="checkbox" class="checkbox" id="terms" />
        <label for="terms" class="checkbox-label">Terms and Conditions</label>
      </div>

      <button class="btn" type="submit">Login</button>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const termsAccepted = ref(false)

const router = useRouter()

const forgot = () => {
  if (!email.value || !password.value || !confirmPassword.value) {
    alert('Please fill all fields.')
    return
  }

  if (password.value !== confirmPassword.value) {
    alert('Passwords do not match.')
    return
  }

  if (!termsAccepted.value) {
    alert('You must accept the Terms and Conditions.')
    return
  }

  const storedUser = JSON.parse(localStorage.getItem('user'))

  if (storedUser && storedUser.email === email.value) {
    storedUser.password = password.value
    localStorage.setItem('user', JSON.stringify(storedUser))

    router.push({ name: 'email-verification-password', query: { email: email.value } })
  } else {
    alert('No user found with that email address.')
  }
}
</script>

<style scoped>
.forgot-container {
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
</style>
