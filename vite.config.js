import { defineConfig } from 'vite';

export default defineConfig({
  root: './', // Alapértelmezett könyvtár
  build: {
    outDir: 'dist', // Az exportált fájlok mappája
    minify: false,  // A minifikálás letiltása
  },
  resolve: {
    alias: {
      '@': '/src', // Alias a src mappára
    },
  },
  mode: 'development', // Fejlesztési mód engedélyezése
});
