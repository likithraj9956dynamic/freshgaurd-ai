import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      // In development, proxy /api and /audio to the local Express backend
      '/api': {
        target: 'http://localhost:5001',
        changeOrigin: true,
      },
      '/audio': {
        target: 'http://localhost:5001',
        changeOrigin: true,
      },
    },
  },
  build: {
    outDir: 'dist',
    // Bump the warning threshold to suppress the chunk size warning
    chunkSizeWarningLimit: 600,
  },
});
