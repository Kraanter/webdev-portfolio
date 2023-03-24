import react from '@vitejs/plugin-react';
import { defineConfig, ServerOptions } from 'vite';

const serverOptions: ServerOptions = {
  proxy: {
    '/api': {
      target: 'http://localhost:3000',
      changeOrigin: true,
      rewrite: (path) => path.replace(/^\/api/, ''),
    },
    '/browser-streamer': {
      target: 'ws://localhost:3000',
      changeOrigin: true,
      ws: true,
    },
  },
  // strictPort: true,
  // hmr: {
  //   port: 3000,
  // },
};

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  logLevel: 'info',
  server: serverOptions,
  preview: serverOptions,
});
