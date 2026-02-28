import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    include: ['lib/**/*.test.ts'],
    coverage: {
      enabled: false,
      provider: 'v8',
      all: true,
      reporter: ['text', 'html'],
      thresholds: {
        lines: 90,
        functions: 90,
        branches: 90,
        statements: 90
      },
      include: ['lib/**/*.ts'],
      exclude: ['lib/**/*.test.ts']
    }
  }
});
