import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,        // чтобы dev-сервер был доступен на 0.0.0.0
  },
  preview: {
    host: true,
    port: process.env.PORT || 4173,
    allowedHosts: ['skinvoltfront.onrender.com']
  }
})