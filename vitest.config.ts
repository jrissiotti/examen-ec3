import { defineConfig } from 'vitest/config';
import vue from '@vitejs/plugin-vue';
import path from 'path';

export default defineConfig({
  plugins: [vue()],
  test: {
    globals: true,
    environment: 'jsdom',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      exclude: ['node_modules/', 'dist/', 'src/backend/'],
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src/frontend'),
      '@backend': path.resolve(__dirname, './src/backend'),
    },
  },
});
