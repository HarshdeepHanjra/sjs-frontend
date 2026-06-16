// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'

// export default defineConfig({
//   plugins: [react()],
//   server: {
//     port: 3000,
//     proxy: {
//       '/api': {
//         target: 'https://sjs-backend-new.onrender.com',
//         changeOrigin: true,
//       }
//     }
//   },
//   css: {
//     postcss: './postcss.config.js',
//   },
//   build: {
//     chunkSizeWarningLimit: 1000,
//     rollupOptions: {
//       output: {
//         manualChunks: {
//           'vendor-react': ['react', 'react-dom', 'react-router-dom'],
//           'vendor-icons': ['react-icons'],
//           'vendor-utils': ['axios', 'react-hot-toast', 'framer-motion']
//         }
//       }
//     }
//   }
// })



import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  
  // ✅ Add this - Project name for Vite
  define: {
    'import.meta.env.VITE_APP_NAME': JSON.stringify('SJS GLOBAL TECH')
  },
  
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'https://sjs-backend-new.onrender.com',
        changeOrigin: true,
      }
    }
  },
  css: {
    postcss: './postcss.config.js',
  },
  build: {
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          'vendor-icons': ['react-icons'],
          'vendor-utils': ['axios', 'react-hot-toast', 'framer-motion']
        }
      }
    }
  }
})