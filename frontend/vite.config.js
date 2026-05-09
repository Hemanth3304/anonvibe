import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Core React — always needed immediately
          'vendor-react': ['react', 'react-dom'],

          // Socket.IO — loaded on app init but heavy; separate chunk
          'vendor-socket': ['socket.io-client'],

          // emoji-picker is ~500KB — only needed when user clicks emoji inside chat
          'vendor-emoji': ['emoji-picker-react'],

          // framer-motion — only used in Entrance screen
          'vendor-framer': ['framer-motion'],

          // axios + image compression — only needed in ChatRoom for file upload
          'vendor-upload': ['axios', 'browser-image-compression'],
        },
      },
    },
    // Raise the warning limit a bit since we've already split intentionally
    chunkSizeWarningLimit: 600,
  },
  server: {
    port: 5173,
  },
});
