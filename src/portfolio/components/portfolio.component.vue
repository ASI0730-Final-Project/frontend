<template>
  <div v-if="portfolio" class="pv-container">
    <div class="pv-toolbar">
      <button
        v-for="proj in portfolio.projects"
        :key="proj.id"
        @click="selectProject(proj)"
        class="pv-button"
        :class="{ active: selectedProject?.id === proj.id }"
      >
        {{ proj.title }}
      </button>
    </div>

    <div v-if="selectedProject" class="pv-project-details">
      <div class="pv-carousel">
        <img
          v-for="(img, idx) in selectedProject.images || []"
          :key="idx"
          :src="img"
          alt="Imagen del proyecto"
        />
      </div>
      <h3>{{ selectedProject.title }}</h3>
      <p>{{ selectedProject.description }}</p>
      <p><strong>{{ t('portfolio.price') }}:</strong> {{ selectedProject.price }}</p>
      <p><strong>{{ t('portfolio.time') }}:</strong> {{ selectedProject.time }}</p>
      <a
        v-if="selectedProject.gig_link || selectedProject.gigLink"
        :href="selectedProject.gig_link || selectedProject.gigLink"
        target="_blank"
      >
        {{ t('portfolio.viewGig') }}
      </a>
    </div>
  </div>

  <div v-else class="pv-container">
    <div class="pv-empty">
      <p>{{ t('portfolio.noPortfolio') }}</p>
      <router-link to="/portfolio/create" class="pv-button">
        {{ t('portfolio.createPortfolio') }}
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { portfolioService } from '../services/portfolio.service'
import { authService } from '../../shared/services/auth.service'

const { t } = useI18n()

const portfolio = ref(null)
const selectedProject = ref(null)
const isOwner = ref(false)
const currentUser = ref(null)

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
  
function selectProject(project) {
  selectedProject.value = project
}

onMounted(loadPortfolio)
</script>

<style scoped>
.pv-container {
  max-width: 1200px;
  margin: 2rem auto;
  padding: 1.5rem;
  background: #23242a;
  border-radius: 16px;
  color: #fff;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}

.pv-toolbar {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-bottom: 2rem;
  justify-content: center;
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
  min-width: 120px;
  text-align: center;
  text-decoration: none;
}

.pv-button:hover,
.pv-button:focus-visible {
  background: #2e2f36;
  border-color: #7b1fa2;
}

.pv-button.active {
  background: #7b1fa2;
  border-color: #b39ddb;
  color: #fff;
}

.pv-project-details {
  background: #18191d;
  padding: 2rem;
  border-radius: 16px;
  border: 1px solid #35344a;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.pv-carousel {
  display: flex;
  gap: 1rem;
  overflow-x: auto;
  padding-bottom: 1rem;
  margin-bottom: 1rem;
}

.pv-carousel img {
  max-height: 200px;
  border-radius: 10px;
  object-fit: cover;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
}

.pv-project-details h3 {
  font-size: 1.8rem;
  margin-bottom: 0.5rem;
  color: #fff;
}

.pv-project-details p {
  font-size: 1rem;
  color: #bdbdbd;
  margin-bottom: 1rem;
}

.pv-project-details strong {
  color: #b39ddb;
}

.pv-project-details a {
  display: inline-block;
  margin-top: 1rem;
  background: #7b1fa2;
  color: #fff;
  padding: 0.6rem 1.25rem;
  border-radius: 10px;
  font-weight: 600;
  text-decoration: none;
  transition: background 0.3s ease;
}

.pv-project-details a:hover {
  background: #a259c4;
}

.pv-empty {
  text-align: center;
  color: #bdbdbd;
  font-size: 1.2rem;
  margin-top: 2rem;
}

.pv-empty .pv-button {
  margin-top: 1rem;
  background: #7b1fa2;
  border: none;
  color: #fff;
}

.pv-empty .pv-button:hover {
  background: #a259c4;
}

/* Responsive */
@media (max-width: 768px) {
  .pv-toolbar {
    justify-content: flex-start;
    overflow-x: auto;
    padding-bottom: 0.5rem;
  }

  .pv-carousel {
    flex-direction: column;
    align-items: center;
  }

  .pv-carousel img {
    max-height: 150px;
  }
}
</style>
