<template>
  <div class="details-container">
    <div class="option-group">
      <div class="title-bar">
        <h2 class="section-title">Specify your needs</h2>
      </div>

      <div class="option-item">
        <label>Days Delivery</label>
        <Dropdown v-model="responsiveDays" :options="daysOptions" placeholder="Choose (4 - 8)" class="visible-border" />
      </div>

      <div class="option-item">
        <label>Responsive</label>
        <Dropdown v-model="responsiveChoice" :options="yesNoValues" placeholder="Choose (yes/no)" class="visible-border" />
      </div>

      <div class="option-item">
        <label>Revisions</label>
        <Dropdown v-model="revisions" :options="revisionsOptions" placeholder="Choose (0 - 3)" class="visible-border" />
      </div>

      <div class="option-item">
        <label>Pages</label>
        <Dropdown v-model="pagesChoice" :options="yesNoValues" placeholder="Choose (1 - 15)" class="visible-border" />
      </div>

      <div class="option-item">
        <label>Extra Functions</label>
        <Dropdown v-model="extraFunctions" :options="yesNoValues" placeholder="Choose (yes/no)" class="visible-border" />
      </div>

      <div class="option-item">
        <label>Custom Animations</label>
        <Dropdown v-model="customAnimations" :options="yesNoValues" placeholder="Choose (yes/no)" class="visible-border" />
      </div>

      <div class="button-container">
        <button class="start-button">Start the pull</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import Dropdown from 'primevue/dropdown'

const responsiveDays = ref(null)
const responsiveChoice = ref(null)
const revisions = ref(null)
const pagesChoice = ref(null)
const extraFunctions = ref(null)
const customAnimations = ref(null)

const daysOptions = ref([4, 5, 6, 7, 8])
const revisionsOptions = ref([0, 1, 2, 3])
const yesNoValues = ref(['Yes', 'No'])
</script>

<style scoped>
.details-container {
  max-width: 900px;
  margin: 2rem auto;
  padding: 0 1rem;
  font-family: Arial, sans-serif;
}

.option-group {
  padding: 2rem;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  position: relative;
}

.title-bar {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 1rem;
}

.section-title {
  font-size: 1.25rem;
  color: #797b80;
  margin: 0;
}

.option-item {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  margin-bottom: 1.5rem;
  gap: 1.5rem;
}

.option-item label {
  font-weight: bold;
  color: #66686e;
  width: 250px;
  text-align: left;
}

.visible-border {
  flex: 1;
  min-width: 300px;
  border: 1px solid rgb(170, 165, 165) ;
  border-radius: 4px;
  color: #66686e;
  padding-left: 10px;
}

.button-container {
  text-align: center;
  margin-top: 0rem;
}

.start-button {
  padding: 0.4rem 2rem;
  background-color:  #dddddd;
  border: none;
  color: #84868d;
  font-size: 1rem;
  font-weight: bold;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.start-button:hover {
  background-color: #0056b3;
}


</style>
