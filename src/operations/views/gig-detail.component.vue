<script>
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'
import { gigService } from '../services/gig.service'
import { pullService } from '../../pull/services/pulls.service.js'
import { ref, onMounted, computed } from 'vue'
import { v4 as uuidv4 } from 'uuid'

export default {
  name: "gig-detail",
  setup() {
    const { t } = useI18n()
    const route = useRoute()
    const router = useRouter()

    const gig = ref(null)
    const loading = ref(true)
    const error = ref(null)
    const orderError = ref(null)
    const orderSuccess = ref(false)

    const fetchGig = async () => {
      try {
        loading.value = true
        const gigData = await gigService.getGigById(route.params.id)
        gig.value = gigData
      } catch (err) {
        error.value = t('gigs.detailError')
        console.error('Error loading gig:', err)
      } finally {
        loading.value = false
      }
    }

    const orderGig = async () => {
      try {
        orderError.value = null
        orderSuccess.value = false

        const userData = JSON.parse(localStorage.getItem('user'))
        if (!userData) {
          orderError.value = t('errors.notLoggedIn')
          return
        }

        // El modelo espera: gig_id, seller_id, buyer_id, price_init, price_update, state
        const newPull = {
          id: uuidv4(),
          gig_id: gig.value.id,
          seller_id: gig.value.seller?.id,
          buyer_id: userData.id,
          price_init: gig.value.price,
          price_update: gig.value.price,
          state: 'pending',
          created_at: new Date().toISOString()
        }

        const createdPull = await pullService.createPull(newPull)
        if (!createdPull || !createdPull.id) {
          throw new Error('No se pudo crear el pull')
        }
        orderSuccess.value = true

        // Redirigir directamente a la negociación
        router.push({ name: 'pullBuyerView', params: { id: createdPull.id } })

      } catch (err) {
        orderError.value = t('errors.orderFailed')
        console.error('Error creating pull:', err)
      }
    }

    onMounted(fetchGig)

    return {
      t,
      gig,
      loading,
      error,
      orderError,
      orderSuccess,
      orderGig,
      parseTags: (tags) => {
        if (Array.isArray(tags)) {
          // Si ya es un array de palabras, lo retorna tal cual
          return tags.flatMap(tag => tag.split(/\s+/)).filter(Boolean)
        }
        if (typeof tags === 'string') {
          // Si es string, lo separa por espacios
          return tags.split(/\s+/).filter(Boolean)
        }
        return []
      }
    }
  }
}
</script>

<template>
  <div class="gig-detail-container">
    <pv-button 
      label="Back to Gigs"
      icon="pi pi-arrow-left"
      class="mb-4"
      @click="$router.push({ name: 'gigs' })"
    />

    <div v-if="loading" class="loading-spinner">
      <i class="pi pi-spinner pi-spin"></i> {{ t('loading') }}
    </div>

    <div v-else-if="error" class="error-message">
      {{ error }}
    </div>

    <div v-else-if="gig" class="gig-detail-content">
      <div class="gig-header">
        <h1 class="gig-title">{{ gig.title }}</h1>
        <div class="gig-price">
          <template v-if="gig.price !== undefined && gig.price !== null">
            S/ {{ gig.price }}
          </template>
          <template v-else>
            <span style="color: #b71c1c">Precio no disponible</span>
          </template>
        </div>
      </div>

      <div class="gig-seller">
        <div class="seller-info">
          <img 
            v-if="gig.seller?.image" 
            :src="gig.seller.image" 
            :alt="`${gig.seller.name} ${gig.seller.lastname}`"
            class="seller-avatar"
          />
          <pv-avatar 
            v-else
            :label="gig.seller?.name?.charAt(0) + gig.seller?.lastname?.charAt(0)"
            size="large"
            shape="circle"
          />
          <div class="seller-details">
            <h3>{{ gig.seller?.name }} {{ gig.seller?.lastname }}</h3>
            <p class="seller-rating">⭐ 4.9 (25 reviews)</p>
          </div>
        </div>
      </div>

      <div class="gig-image-container">
        <img 
          v-if="gig.image" 
          :src="gig.image" 
          :alt="gig.title"
          class="gig-main-image"
        />
        <div v-else class="gig-image-placeholder">
          No image available
        </div>
      </div>

      <div class="gig-description">
        <h2>{{ t('gigs.aboutThisGig') }}</h2>
        <p>{{ gig.description }}</p>
      </div>

      <div class="gig-details">
        <div class="detail-section">
          <h3>{{ t('gigs.category') }}</h3>
          <p class="detail-info">{{ gig.category }}</p>
        </div>

        <div class="detail-section">
          <h3>{{ t('gigs.deliveryTime') }}</h3>
          <p class="detail-info">{{ gig.delivery_days }} days</p>
        </div>

        <div class="detail-section">
          <h3>{{ t('gigs.revisions') }}</h3>
          <p class="detail-info">{{ gig.revision_count }}</p>
        </div>

        <div class="detail-section">
          <h3>{{ t('gigs.pages') }}</h3>
          <p class="detail-info">{{ gig.page_count }}</p>
        </div>

        <div v-if="gig.extra_features?.length" class="detail-section">
          <h3>{{ t('gigs.extraFeatures') }}</h3>
          <ul>
            <li class="detail-info" v-for="feature in gig.extra_features" :key="feature">
              {{ feature }}
            </li>
          </ul>
        </div>

        <div v-if="gig.tags?.length" class="detail-section">
          <h3>{{ t('gigs.tags') }}</h3>
          <div class="tags-container">
            <span v-for="tag in parseTags(gig.tags)" :key="tag" class="tag">
              {{ tag }}
            </span>
          </div>
        </div>
      </div>

      <div v-if="orderError" class="error-message mt-2">
        {{ orderError }}
      </div>
      <div v-if="orderSuccess" class="success-message mt-2">
        {{ t('gigs.orderSuccess') }}
      </div>

      <div class="gig-actions mt-4">
        <pv-button 
          :label="`Order Now (S/ ${gig.price !== undefined && gig.price !== null ? gig.price : 'N/A'})`"
          icon="pi pi-shopping-cart"
          class="p-button-success"
          @click="orderGig"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.gig-detail-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
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

.gig-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.gig-title {
  font-size: 2rem;
  margin: 0;
}

.gig-price {
  font-size: 1.8rem;
  font-weight: bold;
  color: #1f90ec;
}

.gig-seller {
  margin-bottom: 2rem;
  padding: 1rem;
  background-color: #18191d;
  border-radius: 8px;
}

.seller-info {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.seller-avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  object-fit: cover;
}

.seller-details h3 {
  margin: 0;
  font-size: 1.2rem;
}

.seller-rating {
  margin: 0.2rem 0 0;
  color: #7a7c88;
}

.gig-image-container {
  margin-bottom: 2rem;
}

.gig-main-image {
  width: 100%;
  max-height: 500px;
  object-fit: contain;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.gig-image-placeholder {
  width: 100%;
  height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #25252c;
  border-radius: 8px;
  color: #666;
}

.gig-description {
  margin-bottom: 2rem;
  line-height: 1.6;
}

.gig-description h2 {
  margin-bottom: 1rem;
  font-size: 1.5rem;
}

.gig-details {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.detail-section {
  padding: 1rem;
  background-color: #17171b;
  border-radius: 8px;
}

.detail-section h3 {
  margin-top: 0;
  color: #d9d8dd;
}

.detail-info{
    color: #8e8ea0;
}

.tags-container {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.tag {
  background-color: #202127;
  padding: 0.3rem 0.8rem;
  border-radius: 20px;
  font-size: 0.9rem;
}

.gig-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 2rem;
}
</style> 