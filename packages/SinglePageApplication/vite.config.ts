import react from '@vitejs/plugin-react';
import { defineConfig, ServerOptions } from 'vite';
import makeCert from 'vite-plugin-mkcert';

const serverOptions: ServerOptions = {
  https: true,
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
  plugins: [react(), makeCert()],
  logLevel: 'info',
  server: serverOptions,
  preview: serverOptions,
});
