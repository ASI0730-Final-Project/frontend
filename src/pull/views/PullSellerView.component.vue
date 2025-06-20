<template>
  <div class="p-4 max-w-xl mx-auto space-y-6">
    <div v-if="pull">
      <!-- Banner de estado -->
      <div v-if="pull.state === 'pending'" class="state-banner pending">
        {{ t('pullSeller.stateBanner.pending') }}
      </div>
      <div v-else-if="pull.state === 'in_process'" class="state-banner in-process">
        {{ t('pullSeller.stateBanner.in_process') }}
      </div>
      <div v-else-if="pull.state === 'payed'" class="state-banner in-process">
        {{ t('pullSeller.stateBanner.payed') }}
      </div>
      <div v-else-if="pull.state === 'complete'" class="state-banner finished">
        {{ t('pullSeller.stateBanner.complete') }}
      </div>

      <!-- Precios -->
      <div class="price-header">
        <div class="price-column">
          <div class="price-label">{{ t('pullSeller.price.initial') }}</div>
          <div class="price-value text-green">${{ pull.price_init }}</div>
        </div>
        <div class="price-column">
          <div class="price-label">{{ t('pullSeller.price.buyerOffer') }}</div>
          <div class="price-value text-blue">${{ pull.price_update ?? pull.price_init }}</div>
        </div>
      </div>

      <!-- Acciones -->
      <div class="pull-actions">
        <div class="pull-actions-label">
          <template v-if="pull.state === 'payed' || pull.state === 'complete'">
            {{ t('pull.actions.cannotClose') }}
          </template>
          <template v-else>
            {{ t('pull.actions.wantToClose') }}
          </template>
        </div>
        <div class="button-group">
          <button class="accept-button" @click="acceptPull" v-if="pull.state === 'pending'">
            {{ t('pull.actions.accept') }}
          </button>
          <button class="cancel-button" @click="leavePull" v-if="pull.state !== 'payed' && pull.state !== 'complete'">
            {{ t('pull.actions.cancel') }}
          </button>
        </div>
      </div>

      <!-- Chat siempre visible -->
      <div class="chat-section">
        <div class="chat-label">{{ t('pull.chat.buyer') }}</div>
        <ChatBox
          v-if="pull && pull.buyer_id && currentUser"
          :user-id="currentUser.id"
          :pull-id="pull.id"
        />
      </div>
    </div>
    <div v-else class="text-gray-500">{{ t('pull.loading') }}</div>
  </div>
</template>

<script>
import { ref, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { pullService } from '../services/pulls.service.js'
import { authService } from '../../shared/services/auth.service.js'
import ChatBox from '../../chat/components/chatbox.components.vue'

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

    const acceptPull = async () => {
      try {
        await pullService.acceptPull(pull.value.id)
        await fetchPull()
      } catch (error) {
        console.error('Error accepting pull:', error)
      }
    }

    const leavePull = async () => {
      await pullService.deletePull(pull.value.id)
      alert(t('pull.alert.cancelled'))
      router.push('/gigs')
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