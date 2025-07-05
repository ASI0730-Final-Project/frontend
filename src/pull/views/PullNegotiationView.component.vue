<template>
  <main class="negotiation-container" role="main" aria-labelledby="negotiation-heading" v-if="pull && gig && otherUser">
    <div class="negotiation-card" role="region" aria-labelledby="gig-details-heading">
      <img
        v-if="gig.image"
        :src="gig.image"
        :alt="'Imagen del servicio: ' + gig.title"
        class="negotiation-image"
      />
      <div class="negotiation-info">
        <h2 id="gig-details-heading">{{ gig.title }}</h2>
        <p>{{ gig.description }}</p>
        <div class="negotiation-user" role="group" aria-label="Información del usuario">
          <span v-if="isSeller" aria-label="Comprador">
            Comprador: {{ otherUser.name }} {{ otherUser.lastname }}
          </span>
          <span v-else aria-label="Vendedor">
            Vendedor: {{ otherUser.name }} {{ otherUser.lastname }}
          </span>
        </div>
        <div class="negotiation-price" role="group" aria-label="Precio acordado">
          <span>Precio: S/ {{ pull.price_update ?? pull.price_init }}</span>
        </div>
        <div class="negotiation-state" role="status" aria-live="polite">
          <span>Estado: {{ pull.state }}</span>
        </div>

        <!-- Seller Actions -->
        <div v-if="isSeller" role="group" aria-label="Acciones para el vendedor">
          <template v-if="pull.state === 'pending'">
            <button
              class="accept-btn"
              @click="acceptPrice"
              aria-label="Aceptar oferta de precio actual"
            >
              Aceptar Oferta
            </button>
          </template>
          <template v-else-if="pull.state === 'in_process'">
            <p style="color: orange;" role="alert" aria-live="assertive">
              Esperando que el comprador realice el pago...
            </p>
          </template>
          <template v-else-if="pull.state === 'payed'">
            <button class="disabled-btn" disabled aria-label="Pago confirmado">
              Pago confirmado
            </button>
          </template>
        </div>

        <!-- Buyer Actions -->
        <div v-if="isBuyer && pull.state === 'in_process'" role="form" aria-label="Formulario de pago">
          <div class="payment-form">
            <h3 id="payment-heading">Datos de pago</h3>
            <div role="group" aria-labelledby="card-number-label">
              <label id="card-number-label" class="sr-only">Número de Tarjeta</label>
              <input
                v-model="card.number"
                placeholder="Número de Tarjeta (16 dígitos)"
                maxlength="16"
                aria-required="true"
                inputmode="numeric"
                pattern="[0-9]{16}"
                aria-describedby="card-number-hint"
              />
              <span id="card-number-hint" class="sr-only">Ingrese 16 dígitos sin espacios</span>
            </div>
            <div class="expiry-cvc-group">
              <div role="group" aria-labelledby="card-expiry-label">
                <label id="card-expiry-label" class="sr-only">Fecha de Expiración</label>
                <input
                  v-model="card.expiry"
                  placeholder="MM/AA"
                  maxlength="5"
                  aria-required="true"
                  inputmode="numeric"
                  pattern="(0[1-9]|1[0-2])\/[0-9]{2}"
                  aria-describedby="card-expiry-hint"
                />
                <span id="card-expiry-hint" class="sr-only">Formato MM/AA (mes/año)</span>
              </div>
              <div role="group" aria-labelledby="card-cvc-label">
                <label id="card-cvc-label" class="sr-only">Código de Seguridad</label>
                <input
                  v-model="card.cvc"
                  placeholder="CVC"
                  maxlength="3"
                  aria-required="true"
                  inputmode="numeric"
                  pattern="[0-9]{3}"
                  aria-describedby="card-cvc-hint"
                />
                <span id="card-cvc-hint" class="sr-only">3 dígitos en el reverso de su tarjeta</span>
              </div>
            </div>
            <div role="group" aria-labelledby="card-name-label">
              <label id="card-name-label" class="sr-only">Nombre del Titular</label>
              <input
                v-model="card.name"
                placeholder="Nombre del titular de la tarjeta"
                aria-required="true"
              />
            </div>
            <button
              class="accept-btn"
              @click="confirmPayment"
              aria-label="Confirmar pago y proceder"
              :disabled="!isPaymentFormValid"
            >
              Siguiente
            </button>
          </div>
        </div>

        <div v-if="isBuyer && pull.state === 'payed'">
          <button
            class="finish-btn"
            @click="finishPull"
            aria-label="Marcar negociación como completada"
          >
            Marcar como completado
          </button>
        </div>
      </div>
    </div>

    <div class="negotiation-chat" role="region" aria-label="Chat de negociación">
      <ChatBox :user-id="otherUser.id" :pull-id="pull.id" />
    </div>
  </main>
  <div v-else class="loading" role="alert" aria-busy="true">Cargando...</div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { pullService } from '../services/pulls.service.js'
import { gigService } from '../../gigs/services/gig.service.js'
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
