<script setup>
import { RouterView } from 'vue-router'
import { useI18n } from 'vue-i18n'
import ToolbarComponent from './public/components/toolbar.component.vue'
import FooterComponent from './public/components/footer.component.vue'

const { t } = useI18n()
</script>

<template>
  <div>
    <ToolbarComponent />
    <main class="main-content">
      <RouterView />
    </main>
    <FooterComponent />
  </div>
</template>

<style scoped>
.main-content {
    flex: 1;
    padding: 1rem;
    overflow-y: auto;
    height: 100vh;
    box-sizing: border-box;
    transition: all 0.3s ease;
}

</style>
