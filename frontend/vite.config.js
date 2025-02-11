import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    emptyOutDir: true, // Clears old builds
    rollupOptions: {
      input: 'public/index.html', // Ensure Vite finds the entry file
    },
  },
});
