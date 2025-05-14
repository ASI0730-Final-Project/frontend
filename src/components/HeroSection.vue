<script setup>
import { useI18n } from 'vue-i18n'
import 'primeicons/primeicons.css'

const { t } = useI18n()
</script>

<template>
  <section class="hero-section">
    <div class="container">
      <h1>
        Searching for <span class="highlight">Gigs</span> U<br />
        are in the right place
      </h1>

      <div class="search-box">
        <input type="search" :placeholder="t('hero.searchPlaceholder')" />
        <button type="submit">
          <i class="pi pi-search" style="font-size: 1rem; color: #ffff"></i>
        </button>
      </div>

      <p class="freelancer-count"><span class="number">#1892</span> {{ t('hero.freelancers') }}</p>
    </div>
  </section>
</template>

<style scoped>
@font-face {
  font-family: 'JacquesFrancois';
  src: url('@/assets/fonts/JacquesFrancois-Regular.ttf') format('truetype');
  font-weight: normal;
  font-style: normal;
}

@font-face {
  font-family: 'InriaSerif';
  src: url('@/assets/fonts/InriaSerif-Regular.ttf') format('truetype');
  font-weight: normal;
  font-style: normal;
}

@font-face {
  font-family: 'KonkhmerSleokchher';
  src: url('@/assets/fonts/KonkhmerSleokchher-Regular.ttf') format('truetype');
  font-weight: normal;
  font-style: normal;
}

.hero-section {
  background-color: #ffffff;
  padding: 100px 0;
  text-align: center;
  color: #ffffff;
}

.container {
  max-width: 85%;
  border-radius: 25px;
  margin: 0 auto;
  padding: 50px 20px;
  background-color: #1b2a2e;
}

h1 {
  font-size: 64px;
  line-height: 1.4;
  margin-bottom: 30px;
  color: #ffffff;
  font-family: 'InriaSerif', serif;
}

.highlight {
  color: #51c2e5;
  font-family: 'JacquesFrancois', serif;
}

.search-box {
  display: flex;
  justify-content: center;
  max-width: 700px;
  margin: 0 auto 20px auto;
  background-color: #ffffff;
  border-radius: 4px 20px 20px 4px;
}

.search-box input {
  flex-grow: 1;
  padding: 15px 20px;
  border: none;
  font-size: 1rem;
  outline: none;
  color: #222325;
}

.search-box button {
  background-color: #222325;
  padding: 0 20px;
  border-radius: 0 4px 4px 0;
  cursor: pointer;
  display: flex;
  align-items: center;
  font-size: 1.2rem;
}

.freelancer-count {
  margin-top: 20px;
  font-size: 32px;
  color: #ffffff;
  font-family: 'InriaSerif', serif;
}

.freelancer-count .number {
  font-size: 48px;
  font-weight: Regular;
  font-family: 'KonkhmerSleokchher';
}
</style>
