import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import VueDevTools from 'vite-plugin-vue-devtools';

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          firebase: ['firebase/auth', 'firebase/app', 'firebase/analytics'],
          vue: ['vue', 'vue-router', 'pinia', '@vueuse/core'],
          bootstrap: ['bootstrap'],
        },
      },
    },
  },
  plugins: [
    vue(),
    VueDevTools(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      'bootstrap$': 'bootstrap/dist/js/bootstrap.esm.min.js',
    },
  },
});
