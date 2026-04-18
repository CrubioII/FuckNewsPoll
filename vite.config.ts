import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  server: {
    proxy: {
      '/api': 'http://localhost:3001',
    },
  },
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico'],
      manifest: {
        name: "F*cks News Poll",
        short_name: "FNPoll",
        description: "Votación en vivo - Comedia",
        theme_color: '#000033',
        background_color: '#000033',
        display: 'standalone',
        start_url: '/',
        icons: [
          { src: 'logo.jpg', sizes: '512x512', type: 'image/jpeg' },
          { src: 'logo.jpg', sizes: '512x512', type: 'image/jpeg', purpose: 'any maskable' }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/.*\.supabase\.co\/.*/i,
            handler: 'NetworkOnly',
          }
        ]
      }
    })
  ],
})
