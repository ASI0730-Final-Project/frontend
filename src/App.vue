<script setup>
import { RouterView } from 'vue-router'
import TheHeader from './components/TheHeader.vue' 
import TheFooter from './components/TheFooter.vue' 
</script>

<template>
  <TheHeader />

  <main>
    <RouterView />
  </main>

  <TheFooter />
</template>

<style scoped>

main {
  min-height: calc(100vh - 150px);
}
</style>
