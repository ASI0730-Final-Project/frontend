<script>
import { useI18n } from 'vue-i18n'
import { gigService } from '../../gigs/services/gig.service'
import { computed } from 'vue'
import { useRouter } from 'vue-router'

export default {
  name: "home",
  title: "Home",
  data() {
    return {
      gigs: [],
      loading: false,
      error: null
    }
  },
  setup() {
    const { t } = useI18n()
    const router = useRouter()
    
    // Solo obtenemos el user guardado localmente (sin llamar API)
    const user = computed(() => {
      const userData = localStorage.getItem('user')
      return userData ? JSON.parse(userData) : null
    })
    
    return { t, user, router }
  },
  async created() {
    try {
      this.loading = true
      // Solo llamada a gigs, sin llamar a /api/v1/User
      this.gigs = await gigService.getAllGigs()
    } catch (error) {
      this.error = this.t('gigs.loadError')
      console.error('Error loading gigs:', error)
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
    },
    handleCardClick() {
      if (!this.user) {
        this.router.push({ name: 'login' })
      }
      // Si está logueado, no hacer nada (solo visualización)
    }
  }
}
</script>

<template>
  <div class="home-container">
    <h1 class="text-4xl mb-2">
      {{ t('home.welcome') }}
      <span v-if="user" class="user-greeting">{{ user.name }}</span>
    </h1>
    <p class="text-xl mb-6">{{ t('home.subtitle') }}</p>
    
    <div v-if="loading" class="loading-spinner">
      <i class="pi pi-spinner pi-spin"></i> {{ t('home.loading') }}
    </div>
    
    <div v-else-if="error" class="error-message">
      {{ error }}
    </div>
    
    <div v-else class="gigs-grid">
      <div 
        v-for="gig in gigs" 
        :key="gig.id"
        class="gig-card"
        @click="handleCardClick"
      >
        <pv-card class="h-full">
          <template #header>
            <div class="gig-image-container">
              <img 
                v-if="gig.image" 
                :src="gig.image" 
                :alt="gig.title"
                class="gig-image"
              />
              <div v-else class="gig-image-placeholder">
                {{ t('gigs.noImage') }}
              </div>
            </div>
          </template>
          
          <template #content>
            <div class="gig-content">
              <div class="gig-seller">
                <img 
                  v-if="gig.seller?.image" 
                  :src="gig.seller.image" 
                  :alt="`${gig.seller.name} ${gig.seller.lastname}`"
                  class="seller-avatar"
                />
                <pv-avatar 
                  v-else
                  :label="gig.seller?.name?.charAt(0) + gig.seller?.lastname?.charAt(0)"
                  size="normal"
                  shape="circle"
                />
                <span class="seller-name">
                  {{ gig.seller?.name }} {{ gig.seller?.lastname }}
                </span>
              </div>
              
              <h3 class="gig-title">{{ gig.title }}</h3>
              <p class="gig-description">{{ gig.description }}</p>
              
              <div class="gig-footer">
                <span class="gig-category">{{ gig.category }}</span>
                <span class="gig-price">{{ formatPrice(gig.price) }}</span>
              </div>
            </div>
          </template>
        </pv-card>
      </div>
    </div>
  </div>
</template>


<style scoped>
.home-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.user-greeting {
  color: #4a148c;
  font-weight: bold;
}

.gigs-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
  padding: 1rem 0;
}

.gig-card {
  transition: transform 0.3s ease;
  cursor: pointer;
}

.gig-card:hover {
  transform: translateY(-5px);
}

.gig-image-container {
  height: 200px;
  overflow: hidden;
}

.gig-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.gig-image-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f5f5f5;
  color: #666;
}

.gig-content {
  padding: 1rem;
}

.gig-seller {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

.seller-avatar {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  object-fit: cover;
}

.seller-name {
  font-size: 0.9rem;
  color: #666;
}

.gig-title {
  font-size: 1.2rem;
  margin: 0.5rem 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.gig-description {
  color: #666;
  font-size: 0.9rem;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
  margin: 0.5rem 0;
}

.gig-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1rem;
}

.gig-category {
  background-color: #e0e0e0;
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
  font-size: 0.8rem;
}

.gig-price {
  font-weight: bold;
  color: #4CAF50;
}

.loading-spinner {
  text-align: center;
  padding: 2rem;
  font-size: 1.2rem;
}

.error-message {
  color: #f44336;
  text-align: center;
  padding: 2rem;
  font-size: 1.2rem;
}

/* Efecto para indicar que se necesita login */
.gig-card:not(.no-hover):hover {
  box-shadow: 0 0 0 2px #4a148c;
}
</style>