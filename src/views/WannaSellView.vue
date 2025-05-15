<template>
    <div class="signup-container">
      <h1 class="title">Wanna Sell?</h1>
      <form @submit.prevent="verify" class="form">
        <div>
          <label class="label">Full Name</label>
          <input v-model="fullName" type="text" class="input" />
        </div>
  
        <div>
          <label class="label">Last Names</label>
          <input v-model="lastNames" type="text" class="input" />
        </div>
  
        <div>
          <label class="label">Email</label>
          <input v-model="email" type="email" class="input" />
        </div>
  
        <div>
          <label class="label">Carnet Universitario:</label>
          <label class="custom-upload">
              <i class="pi pi-upload"></i> Subir documento
              <input type="file" hidden @change="onCarnetUpload" />
            </label>
        </div>
  
        <div>
          <label class="label">DNI:</label>
          <label class="custom-upload">
              <i class="pi pi-upload"></i> Subir documento
              <input type="file" hidden @change="onDniUpload" />
            </label>
        </div>
  
        <div class="checkbox-wrapper">
          <input type="checkbox" v-model="acceptedTerms" class="checkbox" id="terms" />
          <label for="terms" class="checkbox-label">Terms and Conditions</label>
        </div>
  
        <button type="submit" class="btn" :disabled="!acceptedTerms">Verify</button>
      </form>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  import { useRouter } from 'vue-router'
  import 'primeicons/primeicons.css'
  
  const fullName = ref('')
  const lastNames = ref('')
  const email = ref('')
  const acceptedTerms = ref(false)
  
  const onCarnetUpload = (event) => {
    console.log('Carnet uploaded:', event.files)
  }
  
  const onDniUpload = (event) => {
    console.log('DNI uploaded:', event.files)
  }
  
  const router = useRouter()
  const verify = () => {
    alert(`Datos enviados:\n${fullName.value} ${lastNames.value}\n${email.value}`)
    router.push('/confirmation')
  }
  </script>
  
  <style scoped>
  .signup-container {
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
    font-size: 1rem;
    margin-bottom: 0.25rem;
    color: #252525;
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
  
  .custom-upload {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background-color: #eee;
  border-radius: 8px;
  cursor: pointer;
}


  .input:focus {
    border-color: #60a5fa;
    box-shadow: 0 0 0 2px #bfdbfe;
  }
  
  .file-upload {
    background-color: #eee;
    border-radius: 8px;
    padding: 0.6rem 0.75rem;
    border: none;
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
    background-color: #0F2C32;
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
  
