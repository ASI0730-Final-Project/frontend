<script>
import SelectButton from 'primevue/selectbutton'

export default {
  name: 'language-switcher',
  components: {
    'pv-select-button': SelectButton,
  },
  data() {
    return {
      selectedLocale: this.$i18n.locale,
      options: [
        { label: 'En', value: 'en' },
        { label: 'Es', value: 'es' },
      ],
    }
  },
  watch: {
    selectedLocale(newVal) {
      this.$i18n.locale = newVal
      localStorage.setItem('lang', newVal)
    },
  },
}
</script>

<template>
  <div>
    <span id="lang-switcher-label" class="visually-hidden">
      {{ $t('selectLanguage') || 'Language' }}
    </span>

    <pv-select-button
      v-model="selectedLocale"
      :options="options"
      option-label="label"
      option-value="value"
      class="uppercase"
      role="radiogroup"
      aria-labelledby="lang-switcher-label"
    />
  </div>
</template>

<style scoped>
.visually-hidden {
  position: absolute;
  width: 1px;
  height: 1px;
  margin: -1px;
  border: 0;
  overflow: hidden;
  white-space: nowrap;
}
</style>
