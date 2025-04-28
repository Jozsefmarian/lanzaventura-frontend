import { defineConfig } from 'vite';

export default defineConfig({
  root: './', // Alapértelmezett könyvtár
  build: {
    outDir: 'dist', // Az exportált fájlok mappája
    minify: false,  // Ne minifikálja a kódot
  },
  resolve: {
    alias: {
      '@': '/src', // Alias a src mappára
    },
  },
  define: {
    'process.env.NODE_ENV': '"development"',  // Fejlesztői környezet engedélyezése
  },
});
