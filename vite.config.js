import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import viteCompression from 'vite-plugin-compression' // New import

export default defineConfig({
  plugins: [
    react(),
    viteCompression({ algorithm: 'gzip' }), // Added compression plugin
  ],
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    // Removed rollupOptions (optional - chunk splitting now handled automatically)
  },
  server: {
    port: 3000, // Kept server config
  },
})