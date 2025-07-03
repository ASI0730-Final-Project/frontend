<template>
  <section
    class="pulls-container"
    role="region"
    aria-labelledby="my-pulls-title"
  >
    <h2 id="my-pulls-title" class="pulls-title">
      {{ t('toolbar.myPulls') }}
    </h2>

    <div
      v-if="enrichedPulls.length > 0"
      class="pulls-grid"
      role="list"
      aria-label="Lista de solicitudes (pulls)"
    >
      <div
        v-for="pull in enrichedPulls"
        :key="pull.id"
        class="pull-card"
        role="listitem"
        :aria-labelledby="'pull-title-' + pull.id"
      >
        <img
          v-if="pull.gig?.image"
          :src="pull.gig.image"
          class="pull-gig-main-image"
          :alt="pull.gig.title"
        />

        <div class="pull-card-content">
          <div class="pull-user-row">
            <img
              v-if="pull.seller?.image"
              :src="pull.seller.image"
              class="pull-avatar"
              :alt="`Foto de ${pull.seller?.name ?? ''}`"
            />
            <span class="pull-user-name">{{ pull.seller?.name }} {{ pull.seller?.lastname }}</span>
          </div>

          <div class="pull-gig-title" :id="'pull-title-' + pull.id">
            {{ pull.gig?.title }}
          </div>

          <div class="pull-meta-row">
            <span class="pull-category">{{ pull.gig?.category }}</span>
          </div>

          <div class="pull-status-row">
            <span class="pull-status">
              {{ t('gigs.status') }}: {{ t('negotiation.states.' + pull.state) }}
            </span>
          </div>

          <div class="pull-offer-row">
            <span class="pull-offer-label">Oferta actual:</span>
            <span class="pull-offer-value">
              S/ {{ Number(pull.price_update ?? pull.price).toFixed(2) }}
            </span>
          </div>

          <Button
            label="Ver Detalle"
            icon="pi pi-eye"
            class="p-button-sm pull-detail-btn"
            @click="goToPullDetail(pull.id)"
            aria-label="Ver detalle de la solicitud"
          />
        </div>
      </div>
    </div>

    <div
      v-else
      class="pulls-empty"
      role="alert"
      aria-live="polite"
    >
      No tienes pulls disponibles.
    </div>
  </section>
</template>


<script>
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import Button from 'primevue/button'
import { pullService } from '../services/pulls.service'
import { gigService } from '../../operations/services/gig.service'
import { authService } from '../../shared/services/auth.service'

export default {
  name: 'BuyerPullsView',
  components: { Button },
  setup() {
    const buyerPulls = ref([])
    const enrichedPulls = ref([])
    const { t } = useI18n()
    const router = useRouter()

    const fetchPulls = async () => {
      try {
        const user = JSON.parse(localStorage.getItem('user'))
        if (!user?.id) throw new Error('No authenticated user found')
        const pulls = await pullService.getPullsByBuyer(user.id)
        buyerPulls.value = pulls
        // Filtrar pulls con gig_id válido y que no estén finalizados
        const validPulls = pulls.filter(p => !!p.gig_id && p.state !== 'finished')
        // Enriquecer pulls con datos de gig y seller
        const gigIds = [...new Set(validPulls.map(p => p.gig_id))]
        const sellerIds = [...new Set(validPulls.map(p => p.seller_id))]
        const gigs = await Promise.all(gigIds.map(id => gigService.getGigById(id)))
        const sellers = await Promise.all(sellerIds.map(id => authService.getUserById(id)))
        enrichedPulls.value = validPulls.map(pull => ({
          ...pull,
          gig: gigs.find(g => g.id === pull.gig_id),
          seller: sellers.find(s => s.id === pull.seller_id)
        }))
      } catch (error) {
        console.error('Error fetching buyer pulls:', error)
      }
    }

    const goToPullDetail = (id) => {
      router.push({ name: 'pullBuyerView', params: { id } })
    }

    onMounted(fetchPulls)

    return {
      t,
      enrichedPulls,
      goToPullDetail
    }
  }
}
</script>

<style scoped>
.pulls-container {
  max-width: 1400px;
  margin: 2rem auto;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.pulls-title {
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 2rem;
  color: #fff;
  text-align: center;
}
.pulls-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 2rem;
  justify-items: center;
  width: 100%;
}
.pull-card {
  background: #18191d;
  border-radius: 14px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.10);
  overflow: hidden;
  border: 1px solid #23242a;
  display: flex;
  flex-direction: column;
  padding: 0;
  transition: box-shadow 0.2s;
}
.pull-card:hover {
  box-shadow: 0 4px 24px rgba(123,31,162,0.18);
}
.pull-gig-main-image {
  width: 100%;
  height: 220px;
  object-fit: cover;
  background: #23242a;
  border-bottom: 1px solid #23242a;
}
.pull-card-content {
  padding: 1.5rem 1.2rem 1.2rem 1.2rem;
  display: flex;
  flex-direction: column;
  gap: 0.7rem;
}
.pull-user-row {
  display: flex;
  align-items: center;
  gap: 0.7rem;
  margin-bottom: 0.2rem;
}
.pull-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #7b1fa2;
}
.pull-user-name {
  color: #bdbdbd;
  font-size: 1rem;
  font-weight: 500;
}
.pull-gig-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: #fff;
  margin-bottom: 0.2rem;
}
.pull-meta-row {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 0.2rem;
}
.pull-category {
  background: #23242a;
  color: #fff;
  border-radius: 8px;
  padding: 0.2rem 0.8rem;
  font-size: 0.95rem;
  font-weight: 500;
  margin-right: 0.5rem;
  border: 1px solid #333;
}
.pull-status-row {
  margin-bottom: 0.2rem;
}
.pull-status {
  color: #7b1fa2;
  font-weight: 600;
  font-size: 1rem;
}
.pull-detail-btn {
  margin-top: 1rem;
  background: #22c55e;
  color: #fff;
  border-radius: 8px;
  font-weight: 600;
  border: none;
}
.pulls-empty {
  text-align: center;
  color: #bdbdbd;
  margin-top: 2rem;
  font-size: 1.2rem;
}
.pull-offer-row {
  margin-top: 0.5rem;
  margin-bottom: 0.2rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
.pull-offer-label {
  color: #bdbdbd;
  font-weight: 500;
  font-size: 1rem;
}
.pull-offer-value {
  color: #22c55e;
  font-size: 1.1rem;
  font-weight: 700;
}
</style>
