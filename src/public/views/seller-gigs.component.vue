<script>
import { useI18n } from 'vue-i18n'
import { gigService } from '../../gigs/services/gig.service'
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
  <main class="seller-gigs-container" role="main" aria-labelledby="page-title">
    <h1 id="page-title" class="page-title">{{ t('toolbar.myGigs') }}</h1>

    <div v-if="loading" class="loading-state" role="status" aria-live="polite" aria-busy="true">
      <i class="pi pi-spinner pi-spin" aria-hidden="true"></i>
      <span>Loading your gigs...</span>
    </div>

    <div v-else-if="gigs.length === 0" class="empty-state" role="alert" aria-live="polite">
      <p>You haven't created any gigs yet</p>
      <router-link
        :to="{ name: 'createGig' }"
        class="create-link"
        aria-label="Create your first gig"
      >
        Create your first gig
      </router-link>
    </div>

    <div v-else class="gigs-grid" role="list">
      <router-link
        v-for="(gig, index) in gigs"
        :key="gig.id"
        :to="{ name: 'gigDetail', params: { id: gig.id } }"
        class="gig-card-link"
        style="text-decoration: none; color: inherit;"
        role="listitem"
        :aria-labelledby="`gig-title-${index}`"
        :aria-describedby="`gig-desc-${index} gig-price-${index}`"
      >
        <article class="gig-card">
          <div class="gig-image-container">
            <img
              v-if="gig.image"
              :src="gig.image"
              :alt="`Image for ${gig.title} gig`"
              loading="lazy"
            />
            <div v-else class="image-placeholder" aria-hidden="true">
              No Image
            </div>
          </div>
          <div class="gig-details">
            <h3 :id="`gig-title-${index}`" class="gig-title">{{ gig.title }}</h3>
            <p :id="`gig-desc-${index}`" class="description">{{ gig.description }}</p>
            <div class="gig-meta">
              <span :id="`gig-price-${index}`" class="price" aria-label="Price">{{ formatPrice(gig.price) }}</span>
              <span class="category" aria-label="Category">{{ gig.category }}</span>
            </div>
          </div>
        </article>
      </router-link>
    </div>
  </main>
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
  transition: background-color 0.2s ease;
}

.create-link:hover,
.create-link:focus {
  background-color: #3a0d7a;
  outline: 2px solid #5e35b1;
  outline-offset: 2px;
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

.gig-card:hover,
.gig-card:focus-within {
  transform: translateY(-5px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}

.gig-image-container {
  height: 160px;
  overflow: hidden;
  background-color: #25252c;
  border-radius: 8px;
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
  color: #666;
}

.gig-details {
  padding: 1rem;
}

.gig-title {
  margin: 0 0 0.5rem 0;
  font-size: 1.1rem;
  color: #ffffff;
}

.description {
  color: #616263;
  font-size: 0.9rem;
  margin-bottom: 1rem;
  display: -webkit-box;
  -webkit-line-clamp: 3;
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
  color: #333;
}


.gig-card-link:focus {
  outline: none;
}

.gig-card-link:focus-visible .gig-card {
  outline: 2px solid #5e35b1;
  outline-offset: 2px;
}
</style>
