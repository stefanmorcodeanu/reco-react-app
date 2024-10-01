import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Proxy requests starting with /api to the backend server at localhost:5000
      '/api': {
        target: 'https://f791-2a02-908-2540-80e0-21b3-2fbc-fb2c-3b13.ngrok-free.app', // Backend server URL
        changeOrigin: true,  // Needed for virtual hosted sites
      }
    }
  }
})
