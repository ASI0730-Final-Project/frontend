<template>
  <div class="pv-container">
    <h2 class="pv-title">{{ t('portfolioCreate.title') }}</h2>

    <form @submit.prevent="handleSubmit" class="pv-form">
      <label>{{ t('portfolioCreate.sellerId') }}</label>
      <input type="number" v-model="form.sellerId" readonly class="pv-input" />

      <label>{{ t('portfolioCreate.name') }}</label>
      <input v-model="form.name" :placeholder="t('portfolioCreate.namePlaceholder')" class="pv-input" required />

      <label>{{ t('portfolioCreate.description') }}</label>
      <textarea v-model="form.description" :placeholder="t('portfolioCreate.descriptionPlaceholder')" class="pv-textarea" />

      <h3 class="pv-subtitle">{{ t('portfolioCreate.projects') }}</h3>

      <div
        v-for="(proj, index) in form.projects"
        :key="index"
        class="pv-project-form"
      >
        <input
          v-model="proj.title"
          :placeholder="t('portfolioCreate.projectTitle')"
          class="pv-input"
          required
        />
        <textarea
          v-model="proj.description"
          :placeholder="t('portfolioCreate.projectDescription')"
          class="pv-textarea"
        />
        <input
          v-model="proj.price"
          :placeholder="t('portfolioCreate.projectPrice')"
          class="pv-input"
        />
        <input
          v-model="proj.time"
          :placeholder="t('portfolioCreate.projectTime')"
          class="pv-input"
        />
        <input
          v-model="proj.gigLink"
          :placeholder="t('portfolioCreate.projectGigLink')"
          class="pv-input"
        />
        <button type="button" class="pv-button danger" @click="removeProject(index)">
          {{ t('portfolioCreate.removeProject') }}
        </button>
      </div>

      <button type="button" class="pv-button" @click="addProject">
        {{ t('portfolioCreate.addProject') }}
      </button>

      <button type="submit" class="pv-button primary">
        {{ t('portfolioCreate.save') }}
      </button>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { portfolioService } from '../services/portfolio.service'
import { authService } from '../../shared/services/auth.service'

const router = useRouter()
const { t } = useI18n()

const form = ref({
  name: '',
  description: '',
  publishDate: new Date().toISOString(),
  sellerId: null,
  projects: []
})

onMounted(async () => {
  const currentUser = await authService.getCurrentUser()
  if (currentUser) {
    form.value.sellerId = currentUser.id
  }
})

function addProject() {
  form.value.projects.push({
    title: '',
    description: '',
    price: '',
    time: '',
    gigLink: '',
    images: []
  })
}

function removeProject(index) {
  form.value.projects.splice(index, 1)
}

async function handleSubmit() {
  if (!form.value.sellerId) return
  try {
    await portfolioService.createPortfolio(form.value)
    router.push('/home')
  } catch (err) {
    console.error('Error al crear portafolio:', err)
    alert(t('portfolioCreate.error'))
  }
}
</script>

<style scoped>
.pv-container {
  max-width: 900px;
  margin: 2rem auto;
  padding: 2rem;
  background: #23242a;
  border-radius: 16px;
  color: #fff;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}

.pv-title {
  font-size: 2rem;
  margin-bottom: 1rem;
  text-align: center;
}

.pv-subtitle {
  margin-top: 2rem;
  font-size: 1.5rem;
  color: #b39ddb;
}

.pv-form label {
  display: block;
  margin: 0.75rem 0 0.25rem;
  font-weight: bold;
}

.pv-input,
.pv-textarea {
  width: 100%;
  padding: 0.75rem;
  border-radius: 10px;
  border: 1px solid #35344a;
  background: #18191d;
  color: #fff;
  margin-bottom: 1rem;
}

.pv-textarea {
  resize: vertical;
  min-height: 100px;
}

.pv-button {
  background: #18191d;
  border: 2px solid #35344a;
  color: #fff;
  padding: 0.5rem 1.25rem;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 0.75rem;
}

.pv-button.primary {
  background: #7b1fa2;
  border-color: #b39ddb;
}

.pv-button.primary:hover {
  background: #a259c4;
}

.pv-button.danger {
  background: #5e1a1a;
  border-color: #a34a4a;
}

.pv-button.danger:hover {
  background: #8c2e2e;
}

.pv-project-form {
  padding: 1rem;
  margin-bottom: 1rem;
  background: #2a2b32;
  border-radius: 12px;
  border: 1px solid #35344a;
}
</style>
