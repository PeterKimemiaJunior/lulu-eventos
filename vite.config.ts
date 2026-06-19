import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
    build: {
      rollupOptions: {
        input: {
          main: path.resolve(__dirname, 'index.html'),
          admin: path.resolve(__dirname, 'admin.html'),
          contacto: path.resolve(__dirname, 'contacto.html'),
          galeria: path.resolve(__dirname, 'galeria.html'),
          precos: path.resolve(__dirname, 'precos.html'),
          sobre: path.resolve(__dirname, 'sobre.html'),
          testDebug: path.resolve(__dirname, 'test-debug.html'),
        },
      },
    },
  };
});
