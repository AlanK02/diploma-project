import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { fileURLToPath, URL } from 'url';
import nodePolyfills from 'rollup-plugin-node-polyfills';

export default defineConfig({
  plugins: [
    vue(),
    nodePolyfills()  // Add this to include Node polyfills
  ],
  define: {
    'process.env': {},
    'global': {},
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    }
  },
  build: {
    polyfillModulePreload: true,
    rollupOptions: {
      plugins: [
        nodePolyfills()  // Ensure Node polyfills are included in the bundle
      ]
    }
  }
});
