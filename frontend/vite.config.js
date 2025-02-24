import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  css: {
    modules: {
      localsConvention: 'camelCase',
      scopeBehavior: 'local',
    },
    preprocessorOptions: {
      scss: {
        additionalData: `@import "./src/styles/variables.scss";`
      }
    }
  },
  build: {
    cssCodeSplit: true,
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor': ['react', 'react-dom'],
          'styles': ['./src/index.css', './src/App.css']
        }
      }
    }
  },
  optimizeDeps: {
    include: ['react', 'react-dom']
  },
  server: {
    port: 5173,
    strictPort: true,
    cors: true
  }
});
