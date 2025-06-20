<script>
import { useI18n } from 'vue-i18n'
import { gigService } from '../../operations/services/gig.service'
import { useRouter } from 'vue-router'

export default {
  name: "gigs",
  title: "Gigs",
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
    return { t, router }
  },
  async created() {
    try {
      this.loading = true
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
    navigateToGig(gigId) {
      this.router.push({ name: 'gigDetail', params: { id: gigId } })
    }
  }
}
</script>

<template>
  <div class="gigs-page">
    <div class="gigs-header">
      <h1 class="gigs-title">{{ t('home.explore') }}</h1>
      <p class="gigs-subtitle">{{ t('home.subtitle') }}</p>
    </div>
    
    <div v-if="loading" class="loading-container">
      <div class="loading-spinner">
        <i class="pi pi-spinner pi-spin"></i>
        <span>{{ t('home.loading') }}</span>
      </div>
    </div>
    
    <div v-else-if="error" class="error-container">
      <div class="error-message">
        <i class="pi pi-exclamation-triangle"></i>
        <span>{{ error }}</span>
      </div>
    </div>
    
    <div v-else class="gigs-grid">
      <div 
        v-for="gig in gigs" 
        :key="gig.id"
        class="gig-card"
        @click="navigateToGig(gig.id)"
      >
        <!-- Imagen del gig -->
        <div class="gig-image-container">
          <img 
            v-if="gig.image" 
            :src="gig.image" 
            :alt="gig.title"
            class="gig-image"
          />
          <div v-else class="gig-image-placeholder">
            <i class="pi pi-image"></i>
            <span>{{ t('gigs.noImage') }}</span>
          </div>
        </div>
        
        <!-- Contenido del gig -->
        <div class="gig-content">
          <!-- Información del vendedor -->
          <div class="gig-seller">
            <div class="seller-avatar-container">
              <img 
                v-if="gig.seller?.image" 
                :src="gig.seller.image" 
                :alt="`${gig.seller.name} ${gig.seller.lastname}`"
                class="seller-avatar"
              />
              <div v-else class="seller-avatar-placeholder">
                {{ gig.seller?.name?.charAt(0) }}{{ gig.seller?.lastname?.charAt(0) }}
              </div>
            </div>
            <div class="seller-info">
              <span class="seller-name">
                {{ gig.seller?.name }} {{ gig.seller?.lastname }}
              </span>
              <span class="seller-role">{{ t('gigs.seller') }}</span>
            </div>
          </div>
          
          <!-- Título y descripción -->
          <div class="gig-details">
            <h3 class="gig-title">{{ gig.title }}</h3>
            <p class="gig-description">{{ gig.description }}</p>
          </div>
          
          <!-- Footer con categoría y precio -->
          <div class="gig-footer">
            <div class="gig-category">
              <i class="pi pi-tag"></i>
              <span>{{ gig.category }}</span>
            </div>
            <div class="gig-price">
              <span class="price-amount">{{ formatPrice(gig.price) }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.gigs-page {
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem;
  background: #18191d;
  min-height: 100vh;
  color: #fff;
}

.gigs-header {
  text-align: center;
  margin-bottom: 3rem;
}

.gigs-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: #fff;
  margin: 0 0 0.5rem 0;
  background: linear-gradient(135deg, #7b1fa2, #b39ddb);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.gigs-subtitle {
  font-size: 1.1rem;
  color: #bdbdbd;
  margin: 0;
  font-weight: 400;
}

/* Loading y Error */
.loading-container,
.error-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
}

.loading-spinner,
.error-message {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  padding: 2rem;
  border-radius: 16px;
  background: #23242a;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}

.loading-spinner {
  color: #7b1fa2;
}

.loading-spinner i {
  font-size: 2rem;
}

.error-message {
  color: #dc2626;
}

.error-message i {
  font-size: 2rem;
}

/* Grid de gigs */
.gigs-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 2rem;
  padding: 0;
}

/* Card de gig */
.gig-card {
  background: #23242a;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  transition: all 0.3s ease;
  cursor: pointer;
  height: 480px;
  display: flex;
  flex-direction: column;
}

.gig-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 30px rgba(123, 31, 162, 0.2);
  border: 1px solid rgba(123, 31, 162, 0.3);
}

/* Imagen del gig */
.gig-image-container {
  height: 200px;
  overflow: hidden;
  position: relative;
  background: #18191d;
}

.gig-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.gig-card:hover .gig-image {
  transform: scale(1.05);
}

.gig-image-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #2d1b69, #4a148c);
  color: #b39ddb;
  gap: 0.5rem;
}

.gig-image-placeholder i {
  font-size: 2rem;
  opacity: 0.7;
}

.gig-image-placeholder span {
  font-size: 0.9rem;
  opacity: 0.8;
}

/* Contenido del gig */
.gig-content {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  flex: 1;
  gap: 1rem;
}

/* Información del vendedor */
.gig-seller {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #35344a;
}

.seller-avatar-container {
  position: relative;
}

.seller-avatar,
.seller-avatar-placeholder {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 0.9rem;
}

.seller-avatar {
  object-fit: cover;
  border: 2px solid #7b1fa2;
}

.seller-avatar-placeholder {
  background: linear-gradient(135deg, #7b1fa2, #b39ddb);
  color: #fff;
}

.seller-info {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}

.seller-name {
  font-size: 0.95rem;
  font-weight: 600;
  color: #fff;
}

.seller-role {
  font-size: 0.8rem;
  color: #b39ddb;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

/* Detalles del gig */
.gig-details {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.gig-title {
  font-size: 1.3rem;
  font-weight: 700;
  color: #fff;
  margin: 0;
  line-height: 1.3;

  -webkit-box-orient: vertical;
  overflow: hidden;
}

.gig-description {
  color: #bdbdbd;
  font-size: 0.9rem;
  line-height: 1.5;
  margin: 0;
  display: -webkit-box;

  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Footer del gig */
.gig-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 1rem;
  border-top: 1px solid #35344a;
  margin-top: auto;
}

.gig-category {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(123, 31, 162, 0.2);
  color: #b39ddb;
  padding: 0.5rem 0.75rem;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 500;
  border: 1px solid rgba(123, 31, 162, 0.3);
}

.gig-category i {
  font-size: 0.7rem;
}

.gig-price {
  display: flex;
  align-items: center;
}

.price-amount {
  font-size: 1.2rem;
  font-weight: 700;
  color: #22c55e;
  background: rgba(34, 197, 94, 0.1);
  padding: 0.5rem 0.75rem;
  border-radius: 12px;
  border: 1px solid rgba(34, 197, 94, 0.3);
}

/* Responsive */
@media (max-width: 1200px) {
  .gigs-grid {
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 1.5rem;
  }
}

@media (max-width: 768px) {
  .gigs-page {
    padding: 1rem;
  }
  
  .gigs-title {
    font-size: 2rem;
  }
  
  .gigs-grid {
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 1rem;
  }
  
  .gig-card {
    height: 450px;
  }
  
  .gig-content {
    padding: 1rem;
  }
}

@media (max-width: 480px) {
  .gigs-grid {
    grid-template-columns: 1fr;
  }
  
  .gig-card {
    height: 420px;
  }
  
  .gigs-title {
    font-size: 1.8rem;
  }
}
</style>