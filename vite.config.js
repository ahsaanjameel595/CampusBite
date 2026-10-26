import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => ({
  plugins: [react()],
  ...(mode === 'test' ? { esbuild: { jsx: 'automatic' } } : {}),
  test: {
    environment: 'jsdom',
    setupFiles: './tests/setup.js',
    css: true,
  },
}));
