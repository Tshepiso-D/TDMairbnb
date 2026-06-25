import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // String shorthand: forward http://localhost:5173/api -> http://localhost:5000/api
      '/api': 'http://localhost:5000', // Replace 5000 with your actual backend port
    },
  },
})
