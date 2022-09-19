import { createApp } from 'vue';
import { createPinia } from 'pinia';

import App from './App.vue';
import router from './router';

import '@/scss/styles.scss';
import 'bootstrap-icons/font/bootstrap-icons.scss';

import packageInfo from '../package.json';

import { registerSW } from 'virtual:pwa-register';

// eslint-disable-next-line no-console
console.info(`Warband Builder v${packageInfo.version}`);

if ('serviceWorker' in navigator) {
  // && !/localhost/.test(window.location)) {
  registerSW();
}

const app = createApp(App);

app.use(createPinia());
app.use(router);

app.mount('#app');
