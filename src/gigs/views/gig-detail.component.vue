<script>
import { useI18n } from 'vue-i18n'
import { gigService } from '../services/gig.service'
import { pullService } from '../../pull/services/pulls.service.js'
import { computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { v4 as uuidv4 } from 'uuid'

export default {
  name: "gig-detail",
  data() {
    return {
      gig: null,
      loading: false,
      error: null,
      orderError: null,
      orderSuccess: false
    }
  },
  setup() {
    const { t } = useI18n()
    const router = useRouter()
    const route = useRoute()

    const user = computed(() => {
      const userData = localStorage.getItem('user')
      return userData ? JSON.parse(userData) : null
    })

    return { t, router, route, user }
  },
  async created() {
    try {
      this.loading = true

      if (!this.route.params.id) {
        throw new Error('Missing route param: id')
      }

      const gigData = await gigService.getGigById(this.route.params.id)
      this.gig = gigData
    } catch (err) {
      this.error = this.t('gigs.detailError')
      console.error('Error loading gig:', err)
    } finally {
      this.loading = false
    }
  },
  methods: {
    async orderGig() {
      try {
        this.orderError = null
        this.orderSuccess = false

        if (!this.user) {
          this.orderError = this.t('errors.notLoggedIn')
          return
        }

        const newPull = {
          id: uuidv4(),
          gigId: this.gig.id,
          sellerId: this.gig.seller?.id,
          buyerId: this.user.id,
          priceInit: this.gig.price,
          priceUpdate: this.gig.price,
          state: 'pending',
          createdAt: new Date().toISOString()
        }

        const createdPull = await pullService.createPull(newPull)
        if (!createdPull || !createdPull.id) {
          throw new Error('No se pudo crear el pull')
        }

        this.orderSuccess = true
        this.router.push({ name: 'pullBuyerView', params: { id: createdPull.id } })
      } catch (err) {
        this.orderError = this.t('errors.orderFailed')
        console.error('Error creating pull:', err)
      }
    },
    parseTags(tags) {
      if (Array.isArray(tags)) {
        return tags.flatMap(tag => tag.split(/\s+/)).filter(Boolean)
      }
      if (typeof tags === 'string') {
        return tags.split(/\s+/).filter(Boolean)
      }
      return []
    }
  }
}
</script>


<template>
  <div class="gig-detail-container" role="main" aria-labelledby="gig-title">
    <pv-button
      label="Back to Gigs"
      icon="pi pi-arrow-left"
      class="mb-4"
      @click="$router.push({ name: 'gigs' })"
      aria-label="Volver a la lista de Gigs"
    />

    <div v-if="loading" class="loading-spinner" role="status" aria-live="polite">
      <i class="pi pi-spinner pi-spin"></i> {{ t('loading') }}
    </div>

    <div v-else-if="error" class="error-message" role="alert" aria-live="assertive">
      {{ error }}
    </div>

    <div v-else-if="gig" class="gig-detail-content">
      <div class="gig-header">
        <h1 id="gig-title" class="gig-title">{{ gig.title }}</h1>
        <div class="gig-price">
          <template v-if="gig.price !== undefined && gig.price !== null">
            S/ {{ gig.price }}
          </template>
          <template v-else>
            <span style="color: #b71c1c">Precio no disponible</span>
          </template>
        </div>
      </div>

      <section class="gig-seller" role="region" aria-label="Información del vendedor">
        <div class="seller-info">
          <img
            v-if="gig.seller?.image"
            :src="gig.seller.image"
            :alt="`Foto de perfil de ${gig.seller.name} ${gig.seller.lastname}`"
            class="seller-avatar"
          />
          <pv-avatar
            v-else
            :label="gig.seller?.name?.charAt(0) + gig.seller?.lastname?.charAt(0)"
            size="large"
            shape="circle"
            aria-label="Avatar del vendedor"
          />
          <div class="seller-details">
            <h3>{{ gig.seller?.name }} {{ gig.seller?.lastname }}</h3>
            <p class="seller-rating">⭐ 4.9 (25 reviews)</p>
          </div>
        </div>
      </section>

      <section class="gig-image-container" role="region" aria-label="Imagen del servicio">
        <img
          v-if="gig.image"
          :src="gig.image"
          :alt="gig.title"
          class="gig-main-image"
        />
        <div v-else class="gig-image-placeholder" role="note">
          No image available
        </div>
      </section>

      <section class="gig-description" aria-labelledby="about-this-gig">
        <h2 id="about-this-gig">{{ t('gigs.aboutThisGig') }}</h2>
        <p>{{ gig.description }}</p>
      </section>

      <section class="gig-details" role="region" aria-label="Detalles técnicos del servicio">
        <div class="detail-section">
          <h3>{{ t('gigs.category') }}</h3>
          <p class="detail-info">{{ gig.category }}</p>
        </div>

        <div class="detail-section">
          <h3>{{ t('gigs.deliveryTime') }}</h3>
          <p class="detail-info">{{ gig.deliveryDays }} days</p>
        </div>

        <div class="detail-section">
          <h3>{{ t('gigs.revisions') }}</h3>
          <p class="detail-info">{{ gig.revisionCount }}</p>
        </div>

        <div class="detail-section">
          <h3>{{ t('gigs.pages') }}</h3>
          <p class="detail-info">{{ gig.pageCount }}</p>
        </div>

        <div v-if="gig.extraFeatures?.length" class="detail-section">
          <h3>{{ t('gigs.extraFeatures') }}</h3>
          <ul>
            <li class="detail-info" v-for="feature in gig.extraFeatures" :key="feature">
              {{ feature }}
            </li>
          </ul>
        </div>

        <div v-if="gig.tags?.length" class="detail-section">
          <h3>{{ t('gigs.tags') }}</h3>
          <div class="tags-container" role="list" aria-label="Etiquetas asociadas al Gig">
            <span v-for="tag in parseTags(gig.tags)" :key="tag" class="tag" role="listitem">
              {{ tag }}
            </span>
          </div>
        </div>
      </section>

      <div v-if="orderError" class="error-message mt-2" role="alert">
        {{ orderError }}
      </div>
      <div v-if="orderSuccess" class="success-message mt-2" role="status" aria-live="polite">
        {{ t('gigs.orderSuccess') }}
      </div>

      <div class="gig-actions mt-4">
        <pv-button
          :label="`Order Now (S/ ${gig.price !== undefined && gig.price !== null ? gig.price : 'N/A'})`"
          icon="pi pi-shopping-cart"
          class="p-button-success"
          @click="orderGig"
          aria-label="Ordenar ahora"
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
