<template>
  <div v-if="portfolio">
    <div class="pv-toolbar">
      <button
        v-for="proj in portfolio.projects"
        :key="proj.id"
        @click="selectProject(proj)"
        class="pv-button"
      >
        {{ proj.title }}
      </button>

      <!--
      <template v-if="isOwner">
        <button class="pv-button" @click="openEditModal(selectedProject)">Editar</button>
        <button class="pv-button" @click="openNewProjectModal">Añadir Proyecto</button>
      </template>
      -->
    </div>
  
    <div v-if="selectedProject" class="pv-project-details">
      <div class="pv-carousel">
        <img
          v-for="(img, idx) in selectedProject.images || []"
          :key="idx"
          :src="img"
          alt="Imagen"
        />
      </div>
      <h3>{{ selectedProject.title }}</h3>
      <p>{{ selectedProject.description }}</p>
      <p><strong>Precio:</strong> {{ selectedProject.price }}</p>
      <p><strong>Tiempo:</strong> {{ selectedProject.time }}</p>
      <a
        :href="selectedProject.gig_link || selectedProject.gigLink"
        target="_blank"
        class="pv-button"
      >
        Ver Gig
      </a>
    </div>
  </div>

  <div v-else>
    <p>No tienes portafolio aún.</p>
    <router-link to="/portfolio/create" class="pv-button">Crear Portafolio</router-link>
  </div>

  <EditProjectModal
    v-if="showModal"
    :project="editingProject"
    :isNew="isNewProject"
    @save="handleSaveProject"
    @close="closeModal"
  />
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { portfolioService } from '../services/portfolio.service'
import { authService } from '../../shared/services/auth.service'
import EditProjectModal from './EditProjectModal.component.vue'

const portfolio = ref(null)
const selectedProject = ref(null)
const isOwner = ref(false)
const currentUser = ref(null)
const showModal = ref(false)
const editingProject = ref({})
const isNewProject = ref(false)

async function loadPortfolio() {
  currentUser.value = await authService.getCurrentUser()
  if (!currentUser.value) return

  const fetchedPortfolio = await portfolioService.getPortfolioBySellerId(currentUser.value.id)
  if (fetchedPortfolio) {
    portfolio.value = fetchedPortfolio
    selectedProject.value = fetchedPortfolio.projects?.[0] || null
    isOwner.value = currentUser.value.id === fetchedPortfolio.seller_id
  }
}

onMounted(loadPortfolio)

function selectProject(project) {
  selectedProject.value = project
}

function openEditModal(project) {
  editingProject.value = { ...project }
  isNewProject.value = false
  showModal.value = true
}

function openNewProjectModal() {
  editingProject.value = {
    id: crypto.randomUUID(),
    title: '',
    description: '',
    price: '',
    time: '',
    gig_link: '',
    images: []
  }
  isNewProject.value = true
  showModal.value = true
}

async function handleSaveProject(project) {
  if (!portfolio.value) return
  const portfolioId = portfolio.value.id

  try {
    if (isNewProject.value) {
      await portfolioService.addProject(portfolioId, project)
      portfolio.value.projects.push(project)
    } else {
      await portfolioService.updateProject(portfolioId, project)
      const idx = portfolio.value.projects.findIndex(p => p.id === project.id)
      if (idx !== -1) portfolio.value.projects[idx] = project
    }

    selectedProject.value = project
    closeModal()
  } catch (err) {
    console.error('Error guardando proyecto:', err)
  }
}

function closeModal() {
  showModal.value = false
}
</script>

<style scoped>
.pv-button {
  background-color: #222;
  color: #fff;
  padding: 8px 16px;
  margin: 4px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
}

.pv-toolbar {
  margin-bottom: 12px;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.pv-carousel {
  display: flex;
  overflow-x: auto;
  gap: 10px;
  margin-bottom: 10px;
}

.pv-carousel img {
  height: 180px;
  border-radius: 8px;
}

.pv-project-details {
  padding: 10px;
  border-top: 1px solid #ddd;
}
</style>
