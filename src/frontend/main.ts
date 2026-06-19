/**
 * Punto de entrada de la aplicación Vue 3
 * @module main
 */

import { createApp } from 'vue';
import { createPinia } from 'pinia';
import PrimeVue from 'primevue/config';
import ToastService from 'primevue/toastservice';
import Tooltip from 'primevue/tooltip';
import App from './App.vue';
import router from './router';

const app = createApp(App);

app.use(createPinia());
app.use(router);
app.use(PrimeVue, {
  ripple: true,
  inputStyle: 'filled',
});
app.use(ToastService);
app.directive('tooltip', Tooltip);

app.mount('#app');
