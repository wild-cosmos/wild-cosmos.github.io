import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

// import './assets/main.css'
import "bootstrap/dist/css/bootstrap.css";

import packageInfo from '../package.json';

console.info(`Warband Builder v${packageInfo.version}`);

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')
