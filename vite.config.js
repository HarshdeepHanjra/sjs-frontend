import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'https://sjs-backend-new.onrender.com', // ✅ Production backend URL
        changeOrigin: true,
      }
    }
  },
  css: {
    postcss: './postcss.config.js',
  }
})