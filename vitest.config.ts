import { defineConfig } from 'vitest/config';
import path from 'node:path';

export default defineConfig({
  test: {
    environment: 'node',
    include: ['lib/**/*.test.ts', 'lib/**/__tests__/**/*.test.ts'],
  },
  resolve: {
    // Mirror the tsconfig "@/*" path alias so imports resolve in tests.
    alias: { '@': path.resolve(__dirname, '.') },
  },
});
