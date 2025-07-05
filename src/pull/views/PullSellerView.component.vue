<template>
  <main class="p-4 max-w-xl mx-auto space-y-6" role="main" aria-labelledby="seller-negotiation-heading">
    <h1 id="seller-negotiation-heading" class="sr-only">Negociación con el Comprador</h1>

    <div v-if="pull">
      <!-- Banner de estado -->
      <div v-if="pull.state === 'pending'" class="state-banner pending" role="alert" aria-live="polite">
        {{ t('pullSeller.stateBanner.pending') }}
      </div>
      <div v-else-if="pull.state === 'in_process'" class="state-banner in-process" role="alert" aria-live="polite">
        {{ t('pullSeller.stateBanner.in_process') }}
      </div>
      <div v-else-if="pull.state === 'payed'" class="state-banner in-process" role="alert" aria-live="polite">
        {{ t('pullSeller.stateBanner.payed') }}
      </div>
      <div v-else-if="pull.state === 'complete'" class="state-banner finished" role="alert" aria-live="polite">
        {{ t('pullSeller.stateBanner.complete') }}
      </div>

      <!-- Precios -->
      <div class="price-header" role="region" aria-labelledby="prices-heading">
        <h2 id="prices-heading" class="sr-only">Detalles de precios</h2>
        <div class="price-column" role="group" aria-labelledby="initial-price-label">
          <div id="initial-price-label" class="price-label">{{ t('pullSeller.price.initial') }}</div>
          <div class="price-value text-green" aria-live="polite">${{ pull.priceInit }}</div>
        </div>
        <div class="price-column" role="group" aria-labelledby="current-offer-label">
          <div id="current-offer-label" class="price-label">{{ t('pullSeller.price.buyerOffer') }}</div>
          <div class="price-value text-blue" aria-live="polite">${{ pull.priceUpdate ?? pull.priceInit }}</div>
        </div>
      </div>

      <!-- Acciones -->
      <div class="pull-actions" role="region" aria-labelledby="actions-heading">
        <h2 id="actions-heading" class="sr-only">Acciones disponibles</h2>
        <div class="pull-actions-label" role="status" aria-live="polite">
          <template v-if="pull.state === 'payed' || pull.state === 'complete'">
            {{ t('pull.actions.cannotClose') }}
          </template>
          <template v-else>
            {{ t('pull.actions.wantToClose') }}
          </template>
        </div>
        <div class="button-group" role="group" aria-label="Opciones de negociación">
          <button
            class="accept-button"
            @click="acceptPull"
            v-if="pull.state === 'pending'"
            aria-label="Aceptar la oferta actual del comprador"
          >
            {{ t('pull.actions.accept') }}
          </button>
          <button
            class="cancel-button"
            @click="leavePull"
            v-if="pull.state !== 'payed' && pull.state !== 'complete'"
            :aria-disabled="pull.state === 'payed' || pull.state === 'complete'"
            aria-label="Cancelar esta negociación"
          >
            {{ t('pull.actions.cancel') }}
          </button>
        </div>
      </div>

      <!-- Chat -->
      <div class="chat-section" role="region" aria-labelledby="chat-heading">
        <h2 id="chat-heading" class="chat-label">{{ t('pull.chat.buyer') }}</h2>
        <ChatBox
          v-if="pull && pull.buyerId && currentUser"
          :user-id="currentUser.id"
          :pull-id="pull.id"
          aria-label="Área de chat con el comprador"
        />
      </div>
    </div>

    <div v-else class="text-gray-500" role="alert" aria-busy="true">
      {{ t('pull.loading') }}
    </div>
  </main>
</template>

<script>
import { ref, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { pullService } from '../services/pulls.service.js'
import { authService } from '../../shared/services/auth.service.js'
import ChatBox from '../../chat/components/chatbox.components.vue'
import { chatService } from '../../chat/services/chat.service.js'

export default {
  name: 'PullSellerView',
  components: { ChatBox },
  setup() {
    const route = useRoute()
    const router = useRouter()
    const pull = ref(null)
    const currentUser = ref(null)
    const { t } = useI18n()

    const fetchUser = async () => {
      currentUser.value = await authService.getCurrentUser()
    }

    const fetchPull = async () => {
      const id = route.params.id
      pull.value = await pullService.getPullById(id)
    }

    // ✅ Cambia el estado a "in_process"
    const acceptPull = async () => {
      try {
        await pullService.updatePull(pull.value.id, { newState: 'in_process' })
        await fetchPull()
        alert(t('pull.actions.accepted'))
      } catch (error) {
        console.error('Error accepting pull:', error)
        alert(t('pull.actions.errorAccept'))
      }
    }

    // ✅ Cancela (elimina) el pull
    const leavePull = async () => {
      try {
        await chatService.deleteChatByPullId(pull.value.id)
        await pullService.deletePull(pull.value.id)
        alert(t('pull.alert.cancelled'))
        router.push('/gigs')
      } catch (error) {
        console.error('Error deleting pull:', error)
        alert(t('pull.actions.errorCancel'))
      }
    }

    onMounted(async () => {
      await fetchUser()
      await fetchPull()
    })

    watch(pull, (newVal) => {
      if (newVal && newVal.state === 'complete') {
        alert(t('pull.alert.completedRedirect'))
        router.push('/seller-pulls')
      }
    })

    return {
      pull,
      currentUser,
      acceptPull,
      leavePull,
      t
    }
  }
}
</script>

<style scoped>
.state-banner {
  padding: 12px 20px;
  border-radius: 6px;
  margin: 18px 0 10px 0;
  font-size: 1rem;
  text-align: center;
  font-weight: 500;
}
.state-banner.pending {
  background: #fffbe6;
  color: #b45309;
  border: 1px solid #fde68a;
}
.state-banner.in-process {
  background: #e0f2fe;
  color: #0369a1;
  border: 1px solid #7dd3fc;
}
.state-banner.finished {
  background: #dcfce7;
  color: #166534;
  border: 1px solid #bbf7d0;
}
.price-header {
  display: flex;
  justify-content: space-between;
  background: #242424;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 1rem;
}
.price-column {
  flex: 1;
  text-align: center;
}
.price-label {
  font-size: 1.1rem;
  color: #ffffff;
  margin-bottom: 10px;
}
.price-value {
  font-size: 1.5rem;
  font-weight: bold;
}
.text-green {
  color: #4ade80;
}
.text-blue {
  color: #3b82f6;
}
.pull-actions {
  padding: 20px;
  background: #242424;
  text-align: center;
  border-radius: 8px;
  margin-bottom: 1rem;
}
.pull-actions-label {
  font-size: 1.1rem;
  color: #ffffff;
  margin-bottom: 15px;
}
.button-group {
  display: flex;
  justify-content: center;
  gap: 10px;
}
.accept-button {
  padding: 8px 20px;
  background: #4ade80;
  border: none;
  border-radius: 4px;
  color: white;
  cursor: pointer;
  transition: background-color 0.2s;
}
.accept-button:hover {
  background: #22c55e;
}
.cancel-button {
  padding: 8px 20px;
  background: #ef4444;
  border: none;
  border-radius: 4px;
  color: white;
  cursor: pointer;
  transition: background-color 0.2s;
}
.cancel-button:hover {
  background: #dc2626;
}
.chat-section {
  padding: 20px;
  background: #242424;
  margin: 2px 0;
  border-radius: 8px;
}
.chat-label {
  font-size: 1.1rem;
  color: #ffffff;
  margin-bottom: 15px;
  text-align: center;
}
</style>
