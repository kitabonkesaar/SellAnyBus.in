import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    environment: 'node',
    fileParallelism: false,
    maxConcurrency: 1,
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
