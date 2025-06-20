console.log('Application is starting...')
console.log('Base URL:', import.meta.env.BASE_URL)
console.log('API Base URL:', import.meta.env.VITE_API_BASE_URL)

import { createApp } from 'vue'
import App from './App.vue'
import PrimeVue from 'primevue/config'
import { 
  Avatar, Button, Card, Dropdown, InputNumber, InputText, 
  Textarea, Toolbar, Tooltip 
} from 'primevue'
import Lara from '@primevue/themes/lara'
import i18n from "./i18n.js";
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';
import router from './router'

const app = createApp(App)

app
  .use(PrimeVue, { ripple: true, theme: { preset: Lara } })
  .use(router)
  .component('pv-button', Button)
  .component('pv-card', Card)
  .component('pv-dropdown', Dropdown)
  .component('pv-input-number', InputNumber)
  .component('pv-input-text', InputText)
  .component('pv-textarea', Textarea)
  .component('pv-toolbar', Toolbar)
  .component('pv-tooltip', Tooltip)
  .component('pv-avatar', Avatar)
  .use(i18n)
  .mount('#app')