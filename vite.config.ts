import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  // Dev server proxy to avoid CORS during local development
  server: {
    proxy: {
      '/products': {
        target: 'http://localhost:5506',
        changeOrigin: true,
        secure: false,
      },
      '/product-images': {
        target: 'http://localhost:5506',
        changeOrigin: true,
        secure: false,
      },
      '/site-setting': {
        target: 'http://localhost:5506',
        changeOrigin: true,
        secure: false,
      },
    },
  },
})