import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { VueFire, VueFireAuth } from 'vuefire';
import App from './App.vue';
import router from './router';
import { firebaseApp } from './firebase';
import '@/scss/styles.scss';
import 'bootstrap-icons/font/bootstrap-icons.scss';
import 'bootstrap';

import packageInfo from '../package.json';

// eslint-disable-next-line no-console
console.info(`Warband Builder v${packageInfo.version}`);

const app = createApp(App);

app.use(VueFire, {
  firebaseApp,
  modules: [
    VueFireAuth(),
  ],
});
app.use(createPinia());
app.use(router);

app.mount('#app');
