<template>
  <div class="signup-container">
    <h1 class="title">Sign Up</h1>
    <form @submit.prevent="register" class="form">
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
        <input v-model="password" type="password" class="input" required />
      </div>

      <div>
        <label class="label">Confirm Password</label>
        <input v-model="confirmPassword" type="password" class="input" required />
      </div>

      <div>
        <label class="label">Profile Image</label>
        <input type="file" @change="onFileChange" class="input" accept="image/*" />
      </div>

      <div class="checkbox-wrapper">
        <input type="checkbox" class="checkbox" id="terms" required />
        <label for="terms" class="checkbox-label">Terms and Conditions</label>
      </div>

      <button type="submit" class="btn">Create Account</button>

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

const firstName = ref('')
const lastName = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const imageBase64 = ref('')
const router = useRouter()

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

const register = () => {
  if (password.value !== confirmPassword.value) {
    alert('Passwords do not match.')
    return
  }

  const user = {
    firstName: firstName.value,
    lastName: lastName.value,
    email: email.value,
    password: password.value,
    image: imageBase64.value,
  }

  localStorage.setItem('user', JSON.stringify(user))
  alert('Account created successfully!')
  router.push('/login')
}
</script>

<style scoped>
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
