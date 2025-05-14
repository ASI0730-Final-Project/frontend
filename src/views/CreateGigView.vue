<template>
  <div class="create-gig-view">
    <h1>Create a New Gig</h1>
    <component
      :is="currentForm"
      :gigInfo="gigInfoData"
      @next-step="handleNextStep"
      @submit-all="handleSubmitAll"
    />
    <div v-if="currentForm === 'SetGigPricing'">
      <button @click="goBack">Go Back</button>
    </div>
  </div>
</template>

<script>
import SetGigInfo from './SetGigInfo.vue'
import SetGigPricing from './SetGigPricing.vue'

export default {
  components: {
    SetGigInfo,
    SetGigPricing,
  },
  data() {
    return {
      currentForm: 'SetGigInfo',
      gigInfoData: {},
      gigPricingData: {},
      allGigData: {},
    }
  },
  methods: {
    handleNextStep(infoData) {
      this.gigInfoData = { ...this.gigInfoData, ...infoData }
      this.currentForm = 'SetGigPricing'
    },
    handleSubmitAll(pricingData) {
      this.gigPricingData = { ...this.gigPricingData, ...pricingData }
      this.allGigData = { ...this.gigInfoData, ...this.gigPricingData }
      console.log('Datos combinados para enviar:', this.allGigData)

      alert('¡Gig creado! (Datos en la consola)')
    },
    goBack() {
      this.currentForm = 'SetGigInfo'
    },
  },
}
</script>

<style scoped>
.create-gig-view {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
}

h1 {
  margin-bottom: 20px;
  color: #333;
}

button {
  padding: 10px 15px;
  border: 1px solid #ccc;
  border-radius: 4px;
  background-color: #f8f8f8;
  cursor: pointer;
  font-size: 0.9em;
  margin-top: 10px;
}

button:hover {
  background-color: #eee;
}
</style>
