<template>
  <div class="negotiation-container" v-if="pull && gig && otherUser">
    <div class="negotiation-card">
      <img v-if="gig.image" :src="gig.image" :alt="gig.title" class="negotiation-image" />
      <div class="negotiation-info">
        <h2>{{ gig.title }}</h2>
        <p>{{ gig.description }}</p>
        <div class="negotiation-user">
          <span v-if="isSeller">Comprador: {{ otherUser.name }} {{ otherUser.lastname }}</span>
          <span v-else>Vendedor: {{ otherUser.name }} {{ otherUser.lastname }}</span>
        </div>
        <div class="negotiation-price">
          <span>Precio: S/ {{ pull.price_update ?? pull.price_init }}</span>
        </div>
        <div class="negotiation-state">
          <span>Estado: {{ pull.state }}</span>
        </div>

        <!-- Seller -->
        <div v-if="isSeller">
          <template v-if="pull.state === 'pending'">
            <button class="accept-btn" @click="acceptPrice">Aceptar Oferta</button>
          </template>
          <template v-else-if="pull.state === 'in_process'">
            <p style="color: orange;">Esperando que el comprador realice el pago...</p>
          </template>
          <template v-else-if="pull.state === 'payed'">
            <button class="disabled-btn" disabled>Pago confirmado</button>
          </template>
        </div>

        <!-- Buyer -->
        <div v-if="isBuyer && pull.state === 'in_process'">
          <div class="payment-form">
            <h3>Datos de pago</h3>
            <input v-model="card.number" placeholder="Número de Tarjeta (16 dígitos)" maxlength="16" />
            <div class="expiry-cvc-group">
              <input v-model="card.expiry" placeholder="MM/AA" maxlength="5" />
              <input v-model="card.cvc" placeholder="CVC" maxlength="3" />
            </div>
            <input v-model="card.name" placeholder="Nombre del titular de la tarjeta" />
            <button class="accept-btn" @click="confirmPayment">Siguiente</button>
          </div>
        </div>

        <div v-if="isBuyer && pull.state === 'payed'">
          <button class="finish-btn" @click="finishPull">Marcar como completado</button>
        </div>
      </div>
    </div>

    <div class="negotiation-chat">
      <ChatBox :user-id="otherUser.id" :pull-id="pull.id" />
    </div>
  </div>
  <div v-else class="loading">Cargando...</div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { pullService } from '../services/pulls.service.js'
import { gigService } from '../../operations/services/gig.service.js'
import { authService } from '../../shared/services/auth.service.js'
import ChatBox from '../../chat/components/chatbox.components.vue'

const route = useRoute()

const pull = ref(null)
const gig = ref(null)
const otherUser = ref(null)
const currentUser = ref(null)
const isSeller = ref(false)
const isBuyer = ref(false)

const card = ref({ number: '', expiry: '', cvc: '', name: '' })

const isCardValid = computed(() => {
  const numberValid = /^\d{16}$/.test(card.value.number)
  const expiryValid = /^(0[1-9]|1[0-2])\/\d{2}$/.test(card.value.expiry)
  const cvcValid = /^\d{3}$/.test(card.value.cvc)
  const nameValid = card.value.name.trim().length > 0
  return numberValid && expiryValid && cvcValid && nameValid
})

const fetchData = async () => {
  const pullId = route.params.id
  pull.value = await pullService.getPullById(pullId)
  gig.value = await gigService.getGigById(pull.value.gig_id)
  currentUser.value = await authService.getCurrentUser()

  if (currentUser.value.id === pull.value.seller_id) {
    isSeller.value = true
    otherUser.value = await authService.getUserById(pull.value.buyer_id)
  } else {
    isBuyer.value = true
    otherUser.value = await authService.getUserById(pull.value.seller_id)
  }
}

const acceptPrice = async () => {
  await pullService.updatePull(pull.value.id, { state: 'in_process' })
  pull.value.state = 'in_process'
}

const confirmPayment = async () => {
  if (!isCardValid.value) {
    alert('Por favor completa correctamente los datos de la tarjeta.')
    return
  }
  await pullService.updatePull(pull.value.id, { state: 'payed' })
  pull.value.state = 'payed'
}

const finishPull = async () => {
  await pullService.updatePull(pull.value.id, { state: 'complete' })
  pull.value.state = 'complete'
}

onMounted(fetchData)
</script>


<style scoped>
.payment-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 1rem;
  background: #2c2c2c;
  padding: 1rem;
  border-radius: 8px;
}
.payment-form input {
  padding: 0.5rem;
  border-radius: 6px;
  border: 1px solid #444;
  background: #1f1f1f;
  color: #fff;
}
.disabled-btn {
  background: #888;
  color: #222;
  border-radius: 6px;
  padding: 0.5rem 1.5rem;
  font-weight: bold;
  cursor: not-allowed;
  margin-top: 1rem;
}
</style>
