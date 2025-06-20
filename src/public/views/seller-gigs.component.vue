<script>
import { useI18n } from 'vue-i18n'
import { gigService } from '../../operations/services/gig.service'
import { computed } from 'vue'

export default {
  name: "seller-gigs",
  title: "My Gigs",
  setup() {
    const { t } = useI18n()
    return { t }
  },
  data() {
    return {
      gigs: [],
      loading: true
    }
  },
  computed: {
    user() {
      const userData = localStorage.getItem('user')
      return userData ? JSON.parse(userData) : null
    }
  },
  async created() {
    try {
      const allGigs = await gigService.getAllGigs()
      this.gigs = allGigs.filter(gig => gig.seller_id === this.user?.id)
    } catch (error) {
      console.error("Error loading gigs:", error)
    } finally {
      this.loading = false
    }
  },
  methods: {
    formatPrice(price) {
      return new Intl.NumberFormat('es-PE', {
        style: 'currency',
        currency: 'PEN'
      }).format(price)
    }
  }
}
</script>

<template>
  <div class="seller-gigs-container">
    <h1 class="page-title">{{ t('toolbar.myGigs') }}</h1>
    
    <div v-if="loading" class="loading-state">
      <i class="pi pi-spinner pi-spin"></i>
      <span>Loading your gigs...</span>
    </div>
    
    <div v-else-if="gigs.length === 0" class="empty-state">
      <p>You haven't created any gigs yet</p>
      <router-link 
        :to="{ name: 'createGig' }"
        class="create-link"
      >
        Create your first gig
      </router-link>
    </div>
    
    <div v-else class="gigs-grid">
      <router-link
        v-for="gig in gigs"
        :key="gig.id"
        :to="{ name: 'gigDetail', params: { id: gig.id } }"
        class="gig-card-link"
        style="text-decoration: none; color: inherit;"
      >
        <div class="gig-card">
          <div class="gig-image-container">
            <img 
              v-if="gig.image" 
              :src="gig.image" 
              :alt="gig.title"
            />
            <div v-else class="image-placeholder">
              No Image
            </div>
          </div>
          <div class="gig-details">
            <h3>{{ gig.title }}</h3>
            <p class="description">{{ gig.description }}</p>
            <div class="gig-meta">
              <span class="price">{{ formatPrice(gig.price) }}</span>
              <span class="category">{{ gig.category }}</span>
            </div>
          </div>
        </div>
      </router-link>
    </div>
  </div>
</template>

<style scoped>
.seller-gigs-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.page-title {
  font-size: 2rem;
  margin-bottom: 2rem;
  color: #333;
}

.loading-state {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #666;
}

.empty-state {
  text-align: center;
  padding: 2rem;
  background: #f8f9fa;
  border-radius: 8px;
}

.create-link {
  display: inline-block;
  margin-top: 1rem;
  padding: 0.5rem 1rem;
  background: #4a148c;
  color: white;
  border-radius: 4px;
  text-decoration: none;
}

.gigs-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
}

.gig-card {

  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  transition: transform 0.2s ease;
    margin-bottom: 2rem;
  padding: 1rem;
  background-color: #18191d;
  border-radius: 8px;
}

.gig-card:hover {
  transform: translateY(-5px);
}

.gig-image-container {
  height: 160px;
  overflow: hidden;
}

.gig-image-container img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.image-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #25252c;
  border-radius: 8px;
  color: #666;
}

.gig-details {
  padding: 1rem;
}

.gig-details h3 {
  margin: 0 0 0.5rem 0;
  font-size: 1.1rem;
  color: #ffffff;
}

.description {
  color: #616263;
  font-size: 0.9rem;
  margin-bottom: 1rem;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.gig-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.price {
  font-weight: bold;
  color: #28a745;
}

.category {
  background: #e9ecef;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.8rem;
}
</style>