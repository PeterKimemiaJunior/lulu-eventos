import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import fs from 'fs';
import {defineConfig, Plugin} from 'vite';

/**
 * Custom Vite plugin to copy static data and gallery assets into the build output.
 * Vercel runs `vite build` which only includes files from the `public/` directory
 * and bundled JS/CSS. Our `data/content.json` and `assets/galeria/` images live
 * at the project root and must be explicitly copied into `dist/` so they are
 * served as static files in production.
 */
function copyStaticAssets(): Plugin {
  return {
    name: 'copy-static-assets',
    closeBundle() {
      const distDir = path.resolve(__dirname, 'dist');

      // Copy data/content.json
      const srcContent = path.resolve(__dirname, 'data', 'content.json');
      const destContent = path.resolve(distDir, 'data', 'content.json');
      if (fs.existsSync(srcContent)) {
        fs.mkdirSync(path.dirname(destContent), {recursive: true});
        fs.copyFileSync(srcContent, destContent);
        console.log('[vite-plugin] Copied data/content.json to dist/');
      }

      // Copy all files from assets/galeria/
      const srcGaleria = path.resolve(__dirname, 'assets', 'galeria');
      const destGaleria = path.resolve(distDir, 'assets', 'galeria');
      if (fs.existsSync(srcGaleria)) {
        fs.mkdirSync(destGaleria, {recursive: true});
        const files = fs.readdirSync(srcGaleria);
        let count = 0;
        for (const file of files) {
          const srcFile = path.join(srcGaleria, file);
          const destFile = path.join(destGaleria, file);
          if (fs.statSync(srcFile).isFile()) {
            fs.copyFileSync(srcFile, destFile);
            count++;
          }
        }
        console.log(`[vite-plugin] Copied ${count} gallery images to dist/assets/galeria/`);
      }

      // Copy assets/logo.jpg if exists
      const srcLogo = path.resolve(__dirname, 'assets', 'logo.jpg');
      const destLogo = path.resolve(distDir, 'assets', 'logo.jpg');
      if (fs.existsSync(srcLogo)) {
        fs.mkdirSync(path.dirname(destLogo), {recursive: true});
        fs.copyFileSync(srcLogo, destLogo);
        console.log('[vite-plugin] Copied assets/logo.jpg to dist/');
      }
    },
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), copyStaticAssets()],
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
        },
      },
    },
  };
});
