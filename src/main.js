import './assets/main.css';
import { createApp } from 'vue';
import { createPinia } from 'pinia';
import PrimeVue from 'primevue/config';
import App from './App.vue';
import router from './router';

import InputNumber from 'primevue/inputnumber';
import SelectButton from 'primevue/selectbutton';

const app = createApp(App);

app.use(createPinia());
app.use(router);
app.use(PrimeVue);

app.component('InputNumber', InputNumber);
app.component('SelectButton', SelectButton);

app.mount('#app');



//import 'primevue/resources/themes/aura-light-green/theme.css'
//import 'primeicons/primeicons.css'
