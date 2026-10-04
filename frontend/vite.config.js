import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
// VITE_BACKEND_URL is only used for local `vite dev` proxy.
// On Vercel, /api/* is handled by the rewrite rule so no proxy is needed.
const backendUrl = process.env.VITE_BACKEND_URL || 'http://127.0.0.1:8000'

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 80,
    proxy: {
      '/api': {
        target: backendUrl,
        changeOrigin: true
      }
    }
  }
})
