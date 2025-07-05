<template>
  <div class="main-container">
    <div v-if="pull" class="container">
      <h1 id="pull-detail-title" class="sr-only">{{ t('pull.detailsTitle') || 'Detalle del Pull' }}</h1>

      <!-- Estado -->
      <div v-if="pull.state === 'pending'" class="state-banner pending">{{ t('pull.buyer.pending') }}</div>
      <div v-else-if="pull.state === 'in_process'" class="state-banner in-process">{{ t('pull.buyer.in_process') }}</div>
      <div v-else-if="pull.state === 'payed'" class="state-banner in-process">{{ t('pull.buyer.payed') }}</div>
      <div v-else-if="pull.state === 'complete'" class="state-banner finished">{{ t('pull.buyer.complete') }}</div>

      <!-- Precios -->
      <div class="price-header">
        <div class="price-column">
          <div class="price-label">{{ t('pull.initialPrice') }}</div>
          <div class="price-value text-green">${{ pull.priceInit }}</div>
        </div>
        <div class="price-column">
          <div class="price-label">{{ t('pull.yourOffer') }}</div>
          <div class="price-value text-blue">${{ localOffer }}</div>
        </div>
        <div class="price-column">
          <div class="price-label">{{ t('pull.makeOffer') }}</div>
          <div v-if="pull.state === 'pending'" class="offer-input-group">
            <input
              type="number"
              v-model.number="offerInput"
              class="offer-input"
              :placeholder="pull.priceUpdate ?? pull.priceInit"
              min="0"
            />
            <button class="save-button" @click="saveOffer">
              <i class="pi pi-check"></i>
            </button>
          </div>
          <div v-else class="offer-input-group">
            <span class="offer-value-disabled">{{ t('pull.notModifiable') }}</span>
          </div>
        </div>
      </div>

      <!-- Chat -->
      <div class="chat-section">
        <div class="chat-label">{{ t('pull.chatWithSeller') }}</div>
        <ChatBox
          v-if="currentUser && currentUser.id"
          :user-id="String(currentUser.id)"
          :pull-id="pull.id"
          :other-user-name="getOtherUserNameObject()?.name"
        />
      </div>

      <!-- Cancelar -->
      <div class="pull-actions">
        <div class="pull-actions-label">
          <template v-if="pull.state === 'payed' || pull.state === 'complete'">
            {{ t('pull.noLongerClosable') }}
          </template>
          <template v-else>
            {{ t('pull.wantToClose') }}
          </template>
        </div>
        <div class="button-group">
          <button
            class="cancel-button"
            @click="leavePull"
            v-if="pull.state !== 'payed' && pull.state !== 'complete'"
          >
            {{ t('pull.cancel') }}
          </button>
        </div>
      </div>

      <!-- Pago -->
      <div v-if="pull.state === 'in_process'" class="payment-form">
        <h3>{{ t('pull.paymentData') }}</h3>
        <input v-model="card.number" :placeholder="t('pull.cardNumber')" maxlength="16" />
        <div class="expiry-cvc-group">
          <input v-model="card.expiry" :placeholder="t('pull.expiryDate')" maxlength="5" />
          <input v-model="card.cvc" :placeholder="t('pull.cvc')" maxlength="3" />
        </div>
        <input v-model="card.name" :placeholder="t('pull.cardHolder')" />
        <button class="confirm-delivery-button" @click="processPayment">
          {{ t('pull.next') }}
        </button>
      </div>

      <!-- Confirmar entrega -->
      <div v-if="pull.state === 'payed'" class="confirm-delivery-section">
        <button class="confirm-delivery-button" @click="confirmDelivery">
          {{ t('pull.confirmDelivery') }}
        </button>
      </div>
    </div>

    <!-- Loading -->
    <div v-else class="loading">
      <i class="pi pi-spin pi-spinner"></i>
      <span>{{ t('pull.loading') }}</span>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { pullService } from '../services/pulls.service.js'
import { authService } from '../../shared/services/auth.service.js'
import ChatBox from '../../chat/components/chatbox.components.vue'
import { chatService } from '../../chat/services/chat.service.js'

export default {
  name: 'PullBuyerView',
  components: { ChatBox },
  setup() {
    const route = useRoute()
    const router = useRouter()
    const { t } = useI18n()

    const pull = ref(null)
    const offerInput = ref(0)
    const localOffer = ref(0)
    const currentUser = ref(null)
    const otherUser = ref(null)
    const card = ref({ number: '', expiry: '', cvc: '', name: '' })

    const isCardValid = computed(() => {
      const numberValid = /^\d{16}$/.test(card.value.number)
      const expiryValid = /^(0[1-9]|1[0-2])\/\d{2}$/.test(card.value.expiry)
      const cvcValid = /^\d{3}$/.test(card.value.cvc)
      const nameValid = card.value.name.trim().length > 0
      return numberValid && expiryValid && cvcValid && nameValid
    })

    const fetchPull = async () => {
      const id = route.params.id
      const result = await pullService.getPullById(id)
      pull.value = result
      offerInput.value = result.priceUpdate ?? result.priceInit
      localOffer.value = result.priceUpdate ?? result.priceInit
    }

    const fetchUser = async () => {
      currentUser.value = await authService.getCurrentUser()
    }

    const fetchOtherUser = async () => {
      if (pull.value && currentUser.value) {
        const otherId = currentUser.value.id === pull.value.buyerId
          ? pull.value.sellerId
          : pull.value.buyerId
        otherUser.value = await authService.getUserById(otherId)
      }
    }

    const getOtherUserNameObject = () => otherUser.value

    const saveOffer = async () => {
      if (offerInput.value <= 0) {
        alert(t('pull.invalidOffer') || 'La oferta debe ser mayor a 0')
        return
      }

      try {
        await pullService.updatePullPrice(pull.value.id, offerInput.value)
        localOffer.value = offerInput.value
        pull.value.priceUpdate = offerInput.value
        alert(t('pull.offerSent'))
      } catch (error) {
        console.error('Error updating price:', error)
        alert(t('pull.errorUpdatingPrice') || 'Error updating price')
      }
    }

    const leavePull = async () => {
      try {
        await chatService.deleteChatByPullId(pull.value.id)
        await pullService.deletePull(pull.value.id)
        alert(t('pull.cancelled'))
        router.push('/gigs')
      } catch (error) {
        console.error('Error canceling pull:', error)
        alert(t('pull.errorCanceling') || 'Error canceling')
      }
    }

    const processPayment = async () => {
      if (!isCardValid.value) {
        alert(t('pull.invalidCard'))
        return
      }

      try {
        await pullService.updatePull(pull.value.id, { newState: 'payed' })
        await fetchPull()
        alert(t('pull.paymentSuccess'))
      } catch (error) {
        console.error('Error processing payment:', error)
        alert(t('pull.errorProcessingPayment') || 'Error processing payment')
      }
    }

    const confirmDelivery = async () => {
      try {
        await pullService.updatePull(pull.value.id, { newState: 'complete' })
        await fetchPull()
        alert(t('pull.deliveryConfirmed'))
        router.push('/gigs')
      } catch (error) {
        console.error('Error confirming delivery:', error)
        alert(t('pull.errorConfirmingDelivery') || 'Error confirming delivery')
      }
    }

    onMounted(async () => {
      await fetchUser()
      await fetchPull()
      await fetchOtherUser()
    })

    return {
      pull,
      offerInput,
      localOffer,
      saveOffer,
      leavePull,
      currentUser,
      getOtherUserNameObject,
      confirmDelivery,
      card,
      isCardValid,
      processPayment,
      t
    }
  }
}
</script>


<style scoped>
.payment-form {
  background: #1f1f1f;
  padding: 1.5rem;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin: 2rem 0;
}
.payment-form input {
  padding: 10px;
  border: 1px solid #444;
  background: #2c2c2c;
  color: white;
  border-radius: 5px;
}

.main-container {
  min-height: 100vh;
  padding: 20px;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  background: #121212;
}

.container {
  width: 100%;
  max-width: 800px;
  background: #1a1a1a;
  border-radius: 8px;
  overflow: hidden;
}

.price-header {
  display: flex;
  justify-content: space-between;
  background: #242424;
  padding: 20px;
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

.offer-input-group {
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-bottom: 10px;
}

.offer-input {
  width: 100px;
  padding: 8px;
  background: #333;
  border: 1px solid #444;
  border-radius: 4px;
  color: white;
  text-align: right;
}

.save-button {
  padding: 8px 12px;
  background: #4ade80;
  border: none;
  border-radius: 4px;
  color: white;
  cursor: pointer;
}

.chat-section {
  padding: 20px;
  background: #242424;
  margin: 2px 0;
}

.chat-label {
  font-size: 1.1rem;
  color: #ffffff;
  margin-bottom: 15px;
  text-align: center;
}

.pull-actions {
  padding: 20px;
  background: #242424;
  text-align: center;
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

.loading {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  color: #6b7280;
  padding: 40px;
  background: #1a1a1a;
  border-radius: 8px;
}

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

.confirm-delivery-section {
  text-align: center;
  margin: 2rem 0 1rem 0;
}
.confirm-delivery-button {
  padding: 12px 32px;
  background: #22c55e;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 1.1rem;
  font-weight: bold;
  cursor: pointer;
  transition: background 0.2s;
}
.confirm-delivery-button:hover {
  background: #16a34a;
}

@media (max-width: 640px) {
  .main-container {
    padding: 10px;
  }

  .price-header {
    flex-direction: column;
    gap: 20px;
  }

  .button-group {
    flex-direction: column;
  }

  .accept-button,
  .cancel-button {
    width: 100%;
  }
}
</style>
