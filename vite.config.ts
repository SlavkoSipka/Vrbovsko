import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  root: './',
  publicDir: 'public',
  base: '/',
  server: {
    port: 3000,
    open: true,
    host: true
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    emptyOutDir: true,
    sourcemap: false,
    rollupOptions: {
      output: {
      manualChunks: (id) => {
        if (id.includes('react') || id.includes('react-dom') || id.includes('react-router-dom')) {
          return 'react-vendor';
        }
        if (id.includes('@supabase')) {
          return 'supabase';
        }
      }
      }
    }
  }
})
