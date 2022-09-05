import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { VitePWA, type VitePWAOptions } from 'vite-plugin-pwa'

const pwaOptions : Partial<VitePWAOptions> = {
  manifest: {
    name: 'Wild Cosmos Warband Builder',
    short_name: 'Wild Cosmos',
    theme_color: "#F8F9FA",
    icons: [
      {
        src: 'images/touch/homescreen144.png',
        sizes: '144x144',
        type: 'image/png',
      },
    ]
  },
  registerType: 'autoUpdate', 
  devOptions: {
    enabled: true
  },
}

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    outDir: 'docs'
  },
  plugins: [
    vue(), 
    VitePWA(pwaOptions)
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
