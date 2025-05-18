import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      host: '0.0.0.0',
      '/products': 'http://localhost:8082',
      '/api/inventory': 'http://localhost:8083',
      // '/forecasts': 'http://localhost:8083'
    }
  }
})
