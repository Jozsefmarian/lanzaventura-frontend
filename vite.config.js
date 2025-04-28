import { defineConfig } from 'vite';

export default defineConfig({
  root: './', // Alapértelmezett könyvtár
  build: {
    outDir: 'dist', // Az exportált fájlok mappája
  },
  resolve: {
    alias: {
      '@': '/src', // Alias a src mappára
    },
  },
});
