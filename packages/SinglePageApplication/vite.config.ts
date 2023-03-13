import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const serverOptions = {
  proxy: {
    '/api': {
      target: 'http://localhost:3000',
      changeOrigin: true,
      rewrite: (path) => path.replace(/^\/api/, '')
    }
  }
};

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: serverOptions,
  preview: serverOptions,
});
