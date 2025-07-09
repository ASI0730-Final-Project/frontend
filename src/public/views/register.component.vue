<script>
import { useI18n } from 'vue-i18n'
import { authService } from '../../shared/services/auth.service'
import { useRouter } from 'vue-router'

export default {
  name: "register",
  data() {
    return {
      name: '',
      lastname: '',
      email: '',
      password: '',
      role: 'seller',
      error: null,
      success: null,
      loading: false,
      showImageModal: false,
      imageUrl: '', 
    }
  },
  setup() {
    const { t } = useI18n()
    const router = useRouter()
    return { t, router }
  },
  methods: {
    validateForm() {
      this.error = null
      const numberRegex = /\d/
      if (!this.name || numberRegex.test(this.name)) {
        this.error = this.t('auth.errorNameInvalid')
        return false
      }
      if (!this.lastname || numberRegex.test(this.lastname)) {
        this.error = this.t('auth.errorLastnameInvalid')
        return false
      }
      if (!this.email || !this.email.includes('@')) {
        this.error = this.t('auth.errorEmailInvalid')
        return false
      }
      if (!this.password || this.password.length < 6) {
        this.error = this.t('auth.errorPasswordInvalid')
        return false
      }
      return true
    },

    onSubmit() {
      if (!this.validateForm()) {
        this.success = null
        return
      }
      this.error = null
      this.success = null
      this.showImageModal = true
    },

    isValidUrl(url) {
      try {
        new URL(url)
        return true
      } catch {
        return false
      }
    },

    async saveImage() {
      if (this.imageUrl && !this.isValidUrl(this.imageUrl)) {
        this.error = this.t('auth.invalidImageUrl')
        return
      }

      try {
        this.loading = true
        this.error = null

        const payload = {
          name: this.name,
          lastname: this.lastname,
          email: this.email,
          password: this.password,
          role: this.role,
          image: this.imageUrl || null
        }

        const user = await authService.register(payload)

        const credentials = { email: this.email, password: this.password }
        const loginResponse = await authService.login(credentials)

        if (loginResponse && loginResponse.token) {
          localStorage.setItem('user', JSON.stringify(user))
          this.success = this.t('auth.loginSuccess')
          this.closeModal()
          this.router.push({ name: 'login' })
        } else {
          this.error = this.t('auth.registerLoginFailed')
        }
      } catch (error) {
        console.error('Registration error:', error)
        if (!this.success) {
          this.error = this.t('auth.registerFailed')
        }
      } finally {
        this.loading = false
      }
    },

    async skipImage() {
      try {
        this.loading = true
        this.error = null

        const payload = {
          name: this.name,
          lastname: this.lastname,
          email: this.email,
          password: this.password,
          role: this.role,
          image: null
        }

        const user = await authService.register(payload)

        const credentials = { email: this.email, password: this.password }
        const loginResponse = await authService.login(credentials)

        if (loginResponse && loginResponse.token) {
          localStorage.setItem('user', JSON.stringify(user))
          this.success = this.t('auth.loginSuccess')
          this.closeModal()
          this.router.push({ name: 'login' })
        } else {
          this.error = this.t('auth.registerLoginFailed')
        }
      } catch (error) {
        console.error('Registration error:', error)
        if (!this.success) {
          this.error = this.t('auth.registerFailed')
        }
      } finally {
        this.loading = false
      }
    },

    closeModal() {
      this.showImageModal = false
      this.imageUrl = ''
      this.error = null
    }
  }
}
</script>

<template>
  <div class="register-container">
    <div class="register-card">
      <h1 class="register-title">{{ t('auth.register') }}</h1>
      <form @submit.prevent="onSubmit" class="register-form">
        <div class="register-field">
          <label for="name">{{ t('auth.name') }}</label>
          <pv-input-text id="name" v-model="name" type="text" required />
        </div>
        <div class="register-field">
          <label for="lastname">{{ t('auth.lastname') }}</label>
          <pv-input-text id="lastname" v-model="lastname" type="text" required />
        </div>
        <div class="register-field">
          <label for="email">{{ t('auth.email') }}</label>
          <pv-input-text id="email" v-model="email" type="email" required />
        </div>
        <div class="register-field">
          <label for="password">{{ t('auth.password') }}</label>
          <pv-input-text id="password" v-model="password" type="password" required />
        </div>
        <div class="register-field">
          <label for="role">{{ t('auth.role') }}</label>
          <pv-dropdown id="role" v-model="role" :options="['seller', 'buyer']" />
        </div>

        <pv-button
          type="submit"
          :label="t('auth.submit')"
          class="register-btn"
          :loading="loading"
        />

        <div v-if="error" class="register-error" style="color: red;">{{ error }}</div>
        <div v-if="success" class="register-success" style="color: green;">{{ success }}</div>

        <div class="register-link">
          <router-link :to="{ name: 'login' }">{{ t('auth.haveAccount') }}</router-link>
        </div>
      </form>
    </div>

    <!-- Modal para ingresar link de imagen -->
    <div
      v-if="showImageModal"
      class="modal-overlay"
      @click.self="closeModal"
      style="position: fixed; top:0; left:0; width:100%; height:100%; background-color: rgba(0,0,0,0.5); display:flex; justify-content:center; align-items:center; z-index:1000;"
    >
      <div
        class="modal-content"
        style="background:#fff; padding:20px; border-radius:8px; max-width:400px; width:100%; position:relative;"
      >
        <h2 class="modal-title">{{ t('auth.uploadProfileImage') }}</h2>

        <div class="modal-field" style="margin-bottom: 1rem;">
          <label for="image-url" style="display:block; margin-bottom:0.5rem;">{{ t('auth.enterImageUrl') }}</label>
          <input
            id="image-url"
            v-model="imageUrl"
            type="text"
            placeholder="https://example.com/image.jpg"
            style="width: 100%; padding: 0.5rem; border: 1px solid #ccc; border-radius: 4px;"
          />
        </div>

        <div v-if="imageUrl" class="modal-preview" style="margin-bottom: 1rem;">
          <img
            :src="imageUrl"
            alt="Preview"
            style="max-width: 100%; border-radius: 4px; border: 1px solid #ddd;"
            @error="error = t('auth.invalidImageUrl')"
            @load="error = null"
          />
        </div>

        <div v-if="error" class="modal-error" style="color: red; margin-bottom: 1rem;">{{ error }}</div>

        <div
          class="modal-actions"
          style="display:flex; justify-content: flex-end; gap: 10px;"
        >
          <pv-button
            :label="t('auth.save')"
            @click="saveImage"
            :disabled="loading"
            class="save-btn"
          />
          <pv-button
            :label="t('auth.skip')"
            class="p-button-secondary skip-btn"
            @click="skipImage"
            :disabled="loading"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.register-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #18191d;
}
.register-card {
  background: #23242a;
  border-radius: 16px;
  box-shadow: 0 4px 24px rgba(80, 36, 143, 0.10);
  padding: 2.5rem 2rem;
  width: 100%;
  max-width: 420px;
}
.register-title {
  text-align: center;
  font-size: 2rem;
  color: #7b1fa2;
  margin-bottom: 2rem;
}
.register-form {
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
}
.register-field label {
  font-weight: 500;
  color: #bdbdbd;
  margin-bottom: 0.3rem;
  display: block;
}
.register-field input,
.register-field .p-inputtext,
.register-field .p-dropdown {
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
.register-field input:focus,
.register-field .p-inputtext:focus,
.register-field .p-dropdown:focus {
  outline: none;
  border-color: #b39ddb;
  background: #23242a;
}
.register-btn {
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
.register-btn:hover {
  background: #4a148c;
}
.register-btn:disabled {
  opacity: 0.7;
}
.register-error {
  margin-top: 1rem;
  color: #b71c1c;
  background: #2d1a1a;
  padding: 0.7rem 1rem;
  border-radius: 8px;
  text-align: center;
}
.register-link {
  margin-top: 1.5rem;
  text-align: center;
}
.register-link a {
  color: #7b1fa2;
  text-decoration: underline;
  font-weight: 500;
}

/* Modal styles */
.modal-overlay {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
}

.modal-content {
  background: #23242a;
  border-radius: 20px;
  padding: 2.5rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  width: 100%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
  text-align: center;
}

.modal-title {
  color: #7b1fa2;
  font-size: 1.5rem;
  margin-bottom: 2rem;
  font-weight: 600;
}

.modal-file-input {
  margin-bottom: 1.5rem;
}

.file-input {
  display: none;
}

.file-input-label {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem 2rem;
  background: #7b1fa2;
  color: #fff;
  border-radius: 12px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s ease;
  border: 2px dashed #b39ddb;
}

.file-input-label:hover {
  background: #a259c4;
  transform: translateY(-2px);
}

.file-input-label i {
  font-size: 1.2rem;
}

.modal-loading {
  margin: 1.5rem 0;
  color: #7b1fa2;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  font-weight: 500;
}

.modal-loading i {
  font-size: 1.2rem;
}

.modal-preview {
  margin: 1.5rem 0;
  display: flex;
  justify-content: center;
}

.modal-preview img {
  max-width: 100%;
  max-height: 300px;
  border-radius: 12px;
  border: 3px solid #7b1fa2;
  object-fit: contain;
  box-shadow: 0 4px 15px rgba(123, 31, 162, 0.3);
}

.modal-error {
  margin: 1rem 0;
  color: #b71c1c;
  background: #2d1a1a;
  padding: 0.7rem 1rem;
  border-radius: 8px;
  text-align: center;
}

.modal-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-top: 2rem;
}

.save-btn {
  background: #22c55e !important;
  border: none !important;
  color: #fff !important;
  padding: 0.75rem 1.5rem !important;
  border-radius: 8px !important;
  font-weight: 600 !important;
  transition: all 0.3s ease !important;
}

.save-btn:hover {
  background: #16a34a !important;
  transform: translateY(-2px) !important;
}

.save-btn:disabled {
  background: #6b7280 !important;
  opacity: 0.7 !important;
  transform: none !important;
}

.skip-btn {
  background: #6b7280 !important;
  border: none !important;
  color: #fff !important;
  padding: 0.75rem 1.5rem !important;
  border-radius: 8px !important;
  font-weight: 600 !important;
  transition: all 0.3s ease !important;
}

.skip-btn:hover {
  background: #4b5563 !important;
  transform: translateY(-2px) !important;
}

/* Responsive */
@media (max-width: 768px) {
  .modal-content {
    padding: 2rem 1.5rem;
    margin: 1rem;
  }
  
  .modal-title {
    font-size: 1.3rem;
  }
  
  .modal-actions {
    flex-direction: column;
  }
  
  .modal-preview img {
    max-height: 250px;
  }
}

@media (max-width: 480px) {
  .modal-content {
    padding: 1.5rem 1rem;
  }
  
  .file-input-label {
    padding: 0.8rem 1.5rem;
    font-size: 0.9rem;
  }
  
  .modal-preview img {
    max-height: 200px;
  }
}
</style>